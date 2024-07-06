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
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = {
    signUp,
    logIn,
};
