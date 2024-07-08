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
} = require('../../controller/user.controller');
const { checkBooking } = require('../../middleware/checkBooking');
const { checkPaymentTime } = require('../../middleware/checkPaymentTime');

ApiRouter.route('/').get(getAllTicket);

ApiRouter.route('/booking').post(checkBooking, addBookingDetail);

ApiRouter.route('/booking/detail').post(getBookingDetail);

ApiRouter.route('/booking/canceled').post(removeBookingDetail);

ApiRouter.route('/payment').post(checkPaymentTime, addPaymentDetail);

ApiRouter.route('/payment/canceled').post(cancelBooking);

ApiRouter.route('/signup').post(signUp);

ApiRouter.route('/login').post(logIn);

ApiRouter.route('/user/:userId').get(getUserInfor);

module.exports = ApiRouter;
