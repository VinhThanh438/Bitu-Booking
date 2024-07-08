const express = require('express');
const axios = require('../../config/axios.config');
const clientRoute = express.Router();

// get home page
clientRoute.route('/').get(async (req, res) => {
    const getData = await axios.get('/api/v1');
    return res.render('home', { ticketData: getData.data });
});

// booking detail
clientRoute
    .route('/booking/:ticket_id')
    // add booking detail
    .post(async (req, res) => {
        try {
            const ticketId = req.params.ticket_id;
            const userId = req.cookies.userId;

            // create booking detail
            const getBookingData = await axios.post('/api/v1/booking', {
                userId,
                ticketId,
            });

            const bookingId = getBookingData.data.bookingId;

            // get booking detail after creating
            return res.redirect(`/booking/${bookingId}`);
        } catch (error) {
            return res.redirect('/');
        }
    })
    // get booking detail
    .get(async (req, res) => {
        try {
            const bookingId = req.params.ticket_id;

            const getBookingDetail = await axios.post(
                '/api/v1/booking/detail',
                {
                    bookingId: bookingId,
                }
            );
            const data = getBookingDetail.data;

            return res.render('bookingDetail', { data: [data] });
        } catch (error) {
            return res.redirect('/');
        }
    });

// payment handle
clientRoute
    .route('/payment/success')
    .get((req, res) => res.render('paymentSuccess'));

clientRoute.route('/payment').post(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { ticketId, totalPrice } = req.body;
        await axios.post('/api/v1/payment', {
            ticketDetailId: ticketId,
            totalPrice,
            userId,
        });
        return res.render('paymentSuccess');
    } catch (error) {
        if (error.response.status == 402)
            return res.redirect(req.get('Referer'));
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
