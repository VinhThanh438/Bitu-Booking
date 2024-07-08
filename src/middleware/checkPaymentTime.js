const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');
const checkPaymentExpiration = require('../utils/checkExpiredTime');

const checkPaymentTime = async (req, res, next) => {
    try {
        // get data
        let query = 'select * from tb_ticket_detail where status = ?';
        const [getData] = await pool.execute(query, ['booked']);

        const data = getData[0];
        const bookingTime = data.booking_time;

        if (checkPaymentExpiration(bookingTime)) {
            // delete expired booking
            console.log(req.body);
            query = 'delete from tb_ticket_detail where td_id = ?';
            await pool.execute(query, [req.body.ticketDetailId]);

            next(
                new appError(
                    statusCode.BAD_REQUEST,
                    'booking time has expired!'
                )
            );
        }
        next();
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = { checkPaymentTime };
