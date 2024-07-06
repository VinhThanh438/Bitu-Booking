const express = require('express');
const clientRoute = express.Router();

clientRoute.route('/').get((req, res) => {
    return res.render('home');
});

module.exports = clientRoute;
