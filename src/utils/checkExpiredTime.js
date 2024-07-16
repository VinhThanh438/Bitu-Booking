const moment = require('moment');

const checkPaymentExpiration = (bookingTime) => {
    // sql format
    const format = 'YYYY-MM-DD HH:mm:ss';
    // get current time
    const currentTime = moment();
    // format payment time
    const formatBookingTime = moment(bookingTime, format);
    // expiration time (60 seconds)
    const expirationTime = formatBookingTime.clone().add(60, 'seconds');
    // check booking time
    return currentTime.isAfter(expirationTime);
};

module.exports = checkPaymentExpiration;
