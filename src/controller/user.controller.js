const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const signUp = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const query = 'insert into tb_user (user_name, password) values (?, ?)';

        await pool.execute(query, [userName, password]);

        return res.status(statusCode.CREATED).json(message.SUCCESS);
    } catch (error) {
        next(new appError(error));
    }
};

const logIn = async (req, res, next) => {
    try {
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = {
    signUp,
    logIn,
};
