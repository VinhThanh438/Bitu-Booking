const express = require('express');
const ApiRouter = express.Router();
const {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
    removeBookingDetail,
    addPaymentDetail,
    cancelBooking,
} = require('../../controller/ticket.controller');
const {
    signUp,
    logIn,
    getUserInfor,
    getBookingUrl,
    topUpBalance,
} = require('../../controller/user.controller');
const { checkBooking } = require('../../middleware/checkBooking');
const { checkPaymentTime } = require('../../middleware/checkPaymentTime');
const { checkCanceled } = require('../../middleware/checkCanceled');

ApiRouter.route('/').get(getAllTicket);

ApiRouter.route('/booking').post(checkBooking, addBookingDetail);

ApiRouter.route('/booking/detail').post(getBookingDetail);

ApiRouter.route('/booking/canceled').post(removeBookingDetail);

ApiRouter.route('/payment').post(checkPaymentTime, addPaymentDetail);

ApiRouter.route('/payment/canceled').post(checkCanceled, cancelBooking);

ApiRouter.route('/signup').post(signUp);

ApiRouter.route('/login').post(logIn);

ApiRouter.route('/user/:userId').get(getUserInfor);

ApiRouter.route('/booking-url/:userId').get(getBookingUrl);

ApiRouter.route('/topup').post(topUpBalance);

module.exports = ApiRouter;
