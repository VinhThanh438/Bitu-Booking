const express = require('express');
const axios = require('../../config/axios.config');
const clientRoute = express.Router();

// get home page
clientRoute.route('/').get(async (req, res) => {
    const getData = await axios.get('/api/v1');
    return res.render('home', { ticketData: getData.data });
});

clientRoute
    .route('/booking/:ticket_id')
    // add booking detail
    .get(async (req, res) => {
        try {
            const ticketId = req.params.ticket_id;
            const userId = req.cookies.userId;

            // create booking detail
            const getBookingData = await axios.post('/api/v1/booking', {
                userId,
                ticketId,
            });

            // get booking detail
            const getBookingDetail = await axios.post(
                '/api/v1/booking/detail',
                {
                    bookingId: getBookingData.data.bookingId,
                }
            );
            // console.log(getBookingDetail.data);
            return res.send(getBookingDetail.data);
        } catch (error) {
            return res.redirect('/');
        }
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
            res.cookie('userId', userData.data.userId);

            return res.redirect('/');
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

// log out
clientRoute.route('/logout').get((req, res) => {
    res.clearCookie('userName');
    res.clearCookie('userId');
    return res.redirect('/');
});

module.exports = clientRoute;
