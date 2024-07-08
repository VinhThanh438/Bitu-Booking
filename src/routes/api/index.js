const express = require('express');
const ApiRouter = express.Router();
const {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
    removeBookingDetail,
    addPaymentDetail,
} = require('../../controller/ticket.controller');
const { checkBooking } = require('../../middleware/checkBooking');
const { checkPaymentTime } = require('../../middleware/checkPaymentTime');
const { signUp, logIn } = require('../../controller/user.controller');

ApiRouter.route('/').get(getAllTicket);

ApiRouter.route('/booking').post(checkBooking, addBookingDetail);

ApiRouter.route('/booking/detail').post(getBookingDetail);

ApiRouter.route('/booking/canceled').post(removeBookingDetail);

ApiRouter.route('/payment').post(checkPaymentTime, addPaymentDetail);

ApiRouter.route('/signup').post(signUp);

ApiRouter.route('/login').post(logIn);

module.exports = ApiRouter;
