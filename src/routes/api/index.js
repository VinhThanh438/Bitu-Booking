const {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
    removeBookingDetail,
    addPaymentDetail,
} = require('../../controller/ticket.controller');
const { checkBooking } = require('../../middleware/checkBooking');
const { signUp, logIn } = require('../../controller/user.controller');
const express = require('express');
const ApiRouter = express.Router();

ApiRouter.route('/').get(getAllTicket);

ApiRouter.route('/booking').post(checkBooking, addBookingDetail);

ApiRouter.route('/booking/detail').post(getBookingDetail);

ApiRouter.route('/booking/canceled').post(removeBookingDetail);

ApiRouter.route('/payment').post(addPaymentDetail);

ApiRouter.route('/signup').post(signUp);

ApiRouter.route('/login').post(logIn);

module.exports = ApiRouter;
