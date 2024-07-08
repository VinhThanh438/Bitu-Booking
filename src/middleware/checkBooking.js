const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const checkBooking = async (req, res, next) => {
    try {
        const query = 'select * from tb_ticket_detail where status = ?';
        const [getData] = await pool.execute(query, ['booked']);

        const data = getData[0];
        if (data)
            next(
                new appError(
                    statusCode.BAD_REQUEST,
                    'user have an outstanding booking'
                )
            );
        next();
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = { checkBooking };
