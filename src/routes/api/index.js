const express = require('express');
const { getAllTicket } = require('../../controller/ticket.controller');
const ApiRouter = express.Router();

ApiRouter.get('/', getAllTicket);

module.exports = ApiRouter;
