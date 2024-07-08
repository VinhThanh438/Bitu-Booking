const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const signUp = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        // check existed account
        let query = 'select * from tb_user where user_name = ?';
        const [getUserData] = await pool.execute(query, [userName]);

        if (getUserData.length != 0)
            return res
                .status(statusCode.UNAUTHORIZED)
                .json({ message: 'user name already exists!' });

        // create account
        query = 'insert into tb_user (user_name, password) values (?, ?)';

        await pool.execute(query, [userName, password]);

        return res.status(statusCode.CREATED).json(message.SUCCESS);
    } catch (error) {
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
        console.log('get user Data: ', getUserData);

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
    try {
        // get user information
        const userId = req.params.userId;
        let query = 'select user_name, balance from tb_user where user_id = ?';
        const [getUserData] = await pool.execute(query, [userId]);

        // get confirmed booking
        query = `select u.user_name, t.ticket_name, t.ticket_price, td.td_id, td.status, pd.confirmation_time
                from tb_user u
                join tb_ticket_detail td ON u.user_id = td.user_id
                join tb_ticket t ON td.ticket_id = t.ticket_id
                left join tb_payment_details pd ON td.td_id = pd.td_id
                where u.user_id = ? and td.status = ? or td.status = ?`;
        const [getBookingData] = await pool.execute(query, [
            userId,
            'confirmed',
            'canceled',
        ]);
        const userData = [getUserData[0]];
        let bookingData = [getBookingData[0]];
        if (!getBookingData[0]) bookingData = {};

        const data = { userData, bookingData };

        return res.status(statusCode.OK).json(data);
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = {
    signUp,
    logIn,
    getUserInfor,
};
