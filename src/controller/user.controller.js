const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const signUp = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { userName, password } = req.body;

        // check existed account
        let query = 'select * from tb_user where user_name = ?';
        const [getUserData] = await connection.query(query, [userName]);

        if (getUserData.length != 0)
            return res
                .status(statusCode.UNAUTHORIZED)
                .json({ message: 'user name already exists!' });

        // create account
        query = 'insert into tb_user (user_name, password) values (?, ?)';

        await connection.query(query, [userName, password]);

        await connection.commit();
        pool.releaseConnection();

        return res.status(statusCode.CREATED).json(message.SUCCESS);
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection();

        next(new appError(error));
    }
};

const logIn = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        // check user name and password
        const query =
            'select * from tb_user where user_name = ? and password = ?';
        const [getUserData] = await pool.execute(query, [userName, password]);

        if (getUserData.length == 0)
            return res
                .status(statusCode.NOT_FOUND)
                .json({ message: 'user not found' });

        return res.status(statusCode.OK).json({
            userName: getUserData[0].user_name,
            userId: getUserData[0].user_id,
        });
    } catch (error) {
        next(new appError(error));
    }
};

const getUserInfor = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // get user information
        const userId = req.params.userId;
        let query = 'select user_name, balance from tb_user where user_id = ?';
        const [getUserData] = await pool.execute(query, [userId]);

        // get confirmed booking
        query = `select tb_user.user_name, tb_ticket.ticket_name, tb_ticket.ticket_price, 
                tb_ticket_detail.td_id, tb_ticket_detail.status, tb_payment_details.confirmation_time
                from tb_ticket_detail
                join tb_user on tb_user.user_id = tb_ticket_detail.user_id
                join tb_ticket on tb_ticket.ticket_id = tb_ticket_detail.ticket_id
                join tb_payment_details on tb_payment_details.td_id = tb_ticket_detail.td_id
                where tb_user.user_id = ? and tb_ticket_detail.status = ?`;
        const [getBookingData] = await pool.execute(query, [
            userId,
            'confirmed',
        ]);
        const userData = [getUserData[0]];
        let bookingData = getBookingData;
        if (!getBookingData[0]) bookingData = {};

        const data = { userData, bookingData };

        await connection.commit();
        pool.releaseConnection();

        return res.status(statusCode.OK).json(data);
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection();

        next(new appError(error));
    }
};

const getBookingUrl = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const query =
            'select td_id from tb_ticket_detail where user_id = ? and status = ?';
        const [data] = await pool.execute(query, [userId, 'booked']);
        return res.status(statusCode.OK).json({ ticketDetailId: data[0] });
    } catch (error) {
        next(new appError(error));
    }
};

const topUpBalance = async (req, res, next) => {
    try {
        const { money, userId } = req.body;
        const query =
            'update tb_user set balance = balance + ? where user_id = ?';

        await pool.execute(query, [money, userId]);

        return res.status(statusCode.OK).json(message.SUCCESS);
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = {
    signUp,
    logIn,
    getUserInfor,
    getBookingUrl,
    topUpBalance,
};
