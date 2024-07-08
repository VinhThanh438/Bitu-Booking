const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');
const moment = require('moment');

const checkPaymentExpiration = (bookingTime) => {
    // sql format
    const format = 'YYYY-MM-DD HH:mm:ss';
    // get current time
    const currentTime = moment();
    // format payment time
    const formatBookingTime = moment(bookingTime, format);
    // expiration time (15 seconds)
    const expirationTime = formatBookingTime.clone().add(15, 'seconds');
    // check booking time
    return currentTime.isAfter(expirationTime);
};

const checkPaymentTime = async (req, res, next) => {
    try {
        const query = 'select * from tb_ticket_detail where status = ?';
        const [getData] = await pool.execute(query, ['booked']);

        const data = getData[0];
        const bookingTime = data.booking_time;
        console.log(checkPaymentExpiration(bookingTime));
        if (!checkPaymentExpiration(bookingTime))
            next(
                new appError(
                    statusCode.BAD_REQUEST,
                    'booking time has expired!'
                )
            );
        next();
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = { checkPaymentTime };
