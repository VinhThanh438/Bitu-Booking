const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');
const autoCancelQueue = require('../queue/autoCancel.queue');
// const lock = require('async-lock');

const getAllTicket = async (req, res, next) => {
    try {
        const getData = await pool.execute('select * from tb_ticket');
        return res.status(statusCode.OK).json(getData[0]);
    } catch (error) {
        next(new appError(error));
    }
};

const getBookingDetail = async (req, res, next) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const { bookingId } = req.body;

        // get data infor
        let query = `select * from tb_ticket_detail 
        join tb_ticket on tb_ticket_detail.ticket_id = tb_ticket.ticket_id
        join tb_user on tb_ticket_detail.user_id = tb_user.user_id
        where td_id = ?`;

        const [getData] = await connection.query(query, [bookingId]);

        const {
            td_id,
            user_id,
            ticket_id,
            status,
            booking_time,
            user_name,
            ticket_name,
            ticket_price,
        } = getData[0];

        const data = {
            ticketDetailId: td_id,
            userId: user_id,
            ticketId: ticket_id,
            userName: user_name,
            ticketName: ticket_name,
            ticketPrice: ticket_price,
            status,
            bookingTime: booking_time,
        };

        await connection.commit();
        pool.releaseConnection();

        return res.status(statusCode.OK).json(data);
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection();

        next(new appError(error));
    }
};

const addBookingDetail = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { userId, ticketId } = req.body;

        // update ticket number
        let query =
            'update tb_ticket set quantity = quantity - 1 where ticket_id = ? and quantity > 0';
        await connection.query(query, [ticketId]);

        // add booking data
        query =
            'insert into tb_ticket_detail (user_id, ticket_id) values (?, ?)';
        const [data] = await connection.query(query, [userId, ticketId]);

        const bookingId = data.insertId;

        await connection.commit();
        pool.releaseConnection();

        // auto cancel booking after 60 seconds
        autoCancelQueue.add({ bookingId });

        return res.status(statusCode.CREATED).json({ bookingId: bookingId });
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection();

        next(new appError(error));
    }
};

const removeBookingDetail = async (req, res, next) => {
    try {
        const { ticketDetailId } = req.body;

        // delete booking detail
        let query = 'delete from tb_ticket_detail where td_id = ?';
        await pool.execute(query, [ticketDetailId]);

        return res.status(statusCode.OK).json(message.SUCCESS);
    } catch (error) {
        next(new appError(error));
    }
};

const addPaymentDetail = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { ticketDetailId, userId, totalPrice } = req.body;

        // get user data
        let query = 'select * from tb_user where user_id = ?';
        const [getUserData] = await connection.query(query, [userId]);
        const userData = getUserData[0];

        // check user balance
        const { balance } = userData;

        // unsuccessful
        if (balance < totalPrice)
            return next(
                new appError(
                    statusCode.PAYMENT_REQUIRED,
                    'user account does not have sufficient funds'
                )
            );

        // success => update user balance
        const newBalance = balance - totalPrice;
        query = 'update tb_user set balance = ? where user_id = ?';
        await connection.query(query, [newBalance, userId]);

        // create payment detail
        query = 'insert into tb_payment_details (td_id) values (?)';
        await connection.query(query, [ticketDetailId]);

        await connection.commit();
        pool.releaseConnection();

        return res
            .status(statusCode.CREATED)
            .json({ message: 'payment has been confirmed successfully' });
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection();

        next(new appError(error));
    }
};

const cancelBooking = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { ticketDetailId } = req.body;

        // select data
        let query = `select tb_user.user_id, tb_ticket.ticket_price, tb_ticket.ticket_id
                    from tb_ticket_detail
                    join tb_ticket on tb_ticket_detail.ticket_id = tb_ticket.ticket_id
                    join tb_user on tb_ticket_detail.user_id = tb_user.user_id
                    where td_id = ?`;
        const [selectData] = await connection.query(query, [ticketDetailId]);

        const userId = selectData[0].user_id;
        const totalPrice = selectData[0].ticket_price;
        const ticketId = selectData[0].ticket_id;

        // refund to user (refund money = 90% of ticket price)
        const refundMoney = (totalPrice / 100) * 90;
        query = 'update tb_user set balance = balance + ? where user_id = ?';
        await connection.query(query, [refundMoney, userId]);

        // update booking status
        query = 'update tb_ticket_detail set status = ? where td_id = ?';
        await connection.query(query, ['canceled', ticketDetailId]);

        // update quantity
        query =
            'update tb_ticket set quantity = quantity + 1 where ticket_id = ?';
        await connection.query(query, [ticketId]);

        // delete confirmed time
        query = 'delete from tb_payment_details where td_id = ?';
        await connection.query(query, [ticketDetailId]);

        await connection.commit();
        pool.releaseConnection();

        return res
            .status(statusCode.OK)
            .json({ message: 'booking has canceled' });
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection();

        next(new appError(error));
    }
};

module.exports = {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
    removeBookingDetail,
    addPaymentDetail,
    cancelBooking,
};
