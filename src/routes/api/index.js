const express = require('express');
const pool = require('../../config/db.config');
const ApiRouter = express.Router();

ApiRouter.get('/', async (req, res) => {
    const data = await pool.execute('select * from tb_ticket');
    return res.json(data[0]);
});

module.exports = ApiRouter;
