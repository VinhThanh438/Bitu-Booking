const express = require('express');
const axios = require('../../config/axios.config');
const clientRoute = express.Router();

// get home page
clientRoute.route('/').get(async (req, res) => {
    const getData = await axios.get('/api/v1');
    console.log(getData.data);
    return res.render('home', { data: getData.data });
});

// get log in page
clientRoute.route('/login').get((req, res) => res.render('logIn'));

// get sign up page
clientRoute.route('/signup').get((req, res) => res.render('signUp'));

module.exports = clientRoute;
