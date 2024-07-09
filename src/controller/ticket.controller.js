const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const getAllTicket = async (req, res, next) => {
    try {
        const getData = await pool.execute('select * from tb_ticket');
        return res.status(statusCode.OK).json(getData[0]);
    } catch (error) {
        next(new appError(error));
    }
};

const getBookingDetail = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        // get booking infor
        let query = 'select * from tb_ticket_detail where td_id = ?';
        const [bookingData] = await pool.execute(query, [bookingId]);
        const { td_id, user_id, ticket_id, status, booking_time } =
            bookingData[0];

        // get user infor
        query = 'select * from tb_user where user_id = ?';
        const [userData] = await pool.execute(query, [user_id]);
        const userName = userData[0].user_name;

        // get ticket infor
        query = 'select * from tb_ticket where ticket_id = ?';
        const [ticketData] = await pool.execute(query, [ticket_id]);
        const { ticket_name, ticket_price } = ticketData[0];

        const data = {
            ticketDetailId: td_id,
            userId: user_id,
            ticketId: ticket_id,
            userName,
            ticketName: ticket_name,
            ticketPrice: ticket_price,
            status,
            bookingTime: booking_time,
        };

        return res.status(statusCode.OK).json(data);
    } catch (error) {
        next(new appError(error));
    }
};

const addBookingDetail = async (req, res, next) => {
    try {
        const { userId, ticketId } = req.body;

        // add booking data
        let query =
            'insert into tb_ticket_detail (user_id, ticket_id) values (?, ?)';

        const [data] = await pool.execute(query, [userId, ticketId]);

        // update ticket number
        query =
            'update tb_ticket set quantity = quantity - 1 where ticket_id = ? and quantity > 0';
        await pool.execute(query, [ticketId]);

        const bookingId = data.insertId;

        // auto cancel booking after 60 seconds
        setTimeout(async () => {
            let query = 'select * from tb_ticket_detail where td_id = ?';
            const [getData] = await pool.execute(query, [bookingId]);
            const data = getData[0];
            if (data.status == 'booked') {
                query = 'delete from tb_ticket_detail where td_id = ?';
                await pool.execute(query, [bookingId]);
                console.log('he thong da huy ve');
            }
        }, 60000);

        return res.status(statusCode.CREATED).json({ bookingId: bookingId });
    } catch (error) {
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
    try {
        const { ticketDetailId, userId, totalPrice } = req.body;

        // get user data
        let query = 'select * from tb_user where user_id = ?';
        const [getUserData] = await pool.execute(query, [userId]);
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
        await pool.execute(query, [newBalance, userId]);

        // create payment detail
        query = 'insert into tb_payment_details (td_id) values (?)';
        await pool.execute(query, [ticketDetailId]);

        return res
            .status(statusCode.CREATED)
            .json({ message: 'payment has been confirmed successfully' });
    } catch (error) {
        next(new appError(error));
    }
};

const cancelBooking = async (req, res, next) => {
    try {
        const { ticketDetailId } = req.body;

        // select data
        let query = `select tb_user.user_id, tb_ticket.ticket_price, tb_ticket.ticket_id
                    from tb_ticket_detail
                    join tb_ticket on tb_ticket_detail.ticket_id = tb_ticket.ticket_id
                    join tb_user on tb_ticket_detail.user_id = tb_user.user_id
                    where td_id = ?`;
        const [selectData] = await pool.execute(query, [ticketDetailId]);
        const userId = selectData[0].user_id;
        const totalPrice = selectData[0].ticket_price;
        const ticketId = selectData[0].ticket_id;

        // refund to user (refund money = 90% of ticket price)
        const refundMoney = (totalPrice / 100) * 90;
        query = 'update tb_user set balance = balance + ? where user_id = ?';
        await pool.execute(query, [refundMoney, userId]);

        // update booking status
        query = 'update tb_ticket_detail set status = ? where td_id = ?';
        await pool.execute(query, ['canceled', ticketDetailId]);

        // update quantity
        query =
            'update tb_ticket set quantity = quantity + 1 where ticket_id = ?';
        await pool.execute(query, [ticketId]);

        // delete confirmed time
        query = 'delete from tb_payment_details where td_id = ?';
        await pool.execute(query, [ticketDetailId]);

        return res
            .status(statusCode.OK)
            .json({ message: 'booking has canceled' });
    } catch (error) {
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
