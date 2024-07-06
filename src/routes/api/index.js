const express = require('express');
const {
    getAllTicket,
    getBookingDetail,
    addBookingDetail,
} = require('../../controller/ticket.controller');
const ApiRouter = express.Router();

ApiRouter.route('/').get(getAllTicket);

ApiRouter.route('/booking').get(getBookingDetail).post(addBookingDetail);

module.exports = ApiRouter;
