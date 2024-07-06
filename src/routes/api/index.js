const {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
} = require('../../controller/ticket.controller');
const { signUp, logIn } = require('../../controller/user.controller');
const express = require('express');
const ApiRouter = express.Router();

ApiRouter.route('/').get(getAllTicket);

ApiRouter.route('/booking').get(getBookingDetail).post(addBookingDetail);

ApiRouter.route('/signup').post(signUp);

ApiRouter.route('/login').post(logIn);

module.exports = ApiRouter;
