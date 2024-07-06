const express = require('express');
const axios = require('../../config/axios.config');
const clientRoute = express.Router();

clientRoute.route('/').get(async (req, res) => {
    const getData = await axios.get('/api/v1');
    console.log(getData.data);
    return res.render('home', { data: getData.data });
});

module.exports = clientRoute;
