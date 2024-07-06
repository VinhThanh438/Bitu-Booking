const express = require('express');
const axios = require('../../config/axios.config');
const clientRoute = express.Router();

// get home page
clientRoute.route('/').get(async (req, res) => {
    const getData = await axios.get('/api/v1');
    return res.render('home', { ticketData: getData.data });
});

// get log in page
clientRoute
    .route('/login')
    //get log in page
    .get((req, res) => res.render('logIn'))
    // handle log in
    .post(async (req, res) => {
        try {
            const { userName, password } = req.body;

            // check login
            const userData = await axios.post('/api/v1/login', {
                userName: userName,
                password: password,
            });

            // save user information in cookies
            res.cookie('userName', userData.data.userName);

            // get ticket data
            const ticketData = await axios.get('/api/v1');

            return res.render('home', { ticketData: ticketData.data });
        } catch (error) {
            return res.render('logIn');
        }
    });

// sign up
clientRoute
    .route('/signup')
    // get sign up page
    .get((req, res) => res.render('signUp'))
    // create account
    .post(async (req, res) => {
        try {
            const { userName, password } = req.body;

            await axios.post('/api/v1/signup', {
                userName: userName,
                password: password,
            });

            return res.render('logIn');
        } catch (error) {
            return res.render('signUp');
        }
    });

module.exports = clientRoute;
