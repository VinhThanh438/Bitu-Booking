const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const checkCanceled = async (req, res, next) => {
    try {
        const { ticketDetailId } = req.body;
        const query =
            'select * from tb_ticket_detail where td_id = ? and status = ?';
        const [data] = await pool.execute(query, [ticketDetailId, 'canceled']);

        if (data[0])
            return next(
                appError(statusCode.BAD_REQUEST, {
                    message: 'booking has been canceled!',
                })
            );

        next();
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = { checkCanceled };
