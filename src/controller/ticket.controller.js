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
        const { userId, ticketId } = req.body;

        return res.status(statusCode.OK).json(getData[0]);
    } catch (error) {
        next(new appError(error));
    }
};

const addBookingDetail = async (req, res, next) => {
    try {
        const { userId, ticketId } = req.body;

        // get user infor
        let query = 'select * from tb_user where user_id = ?';
        const userData = await pool.execute(query, [userId]);

        // get ticket infor
        query = 'select * from tb_ticket where ticket_id = ?';
        const ticketData = await pool.execute(query, [ticketId]);

        // add booking data
        query =
            'insert into tb_ticket_detail (user_id, ticket_id) values (?, ?)';

        await pool.execute(query, [userId, ticketId]);

        return res.status(statusCode.CREATED).json(message.SUCCESS);
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
};
