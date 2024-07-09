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
            res.cookie(
                'message',
                'Không thể đặt vé, bạn đang có một vé đang trong quá trình thanh toán'
            );
            res.cookie('type', 'red');
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
            res.cookie('message', 'Đơn đặt không tồn tại hoặc đã hết hạn');
            res.cookie('type', 'red');
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
        const { totalPrice, ticketDetailId } = req.body;
        await axios.post('/api/v1/payment', {
            ticketDetailId: ticketDetailId,
            totalPrice,
            userId,
        });
        return res.render('paymentSuccess');
    } catch (error) {
        if (error.response.status == 402) {
            res.cookie('message', 'Tài khoản của bạn không đủ để thanh toán');
            res.cookie('type', 'red');
            return res.redirect(req.get('Referer'));
        }
        res.cookie(
            'message',
            'Không thể đặt vé, bạn đã hết thời gian thực hiện thanh toán'
        );
        res.cookie('type', 'red');
        return res.redirect('/');
    }
});

clientRoute.route('/booking/cancel/:ticketDetailId').get(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const ticketDetailId = req.params.ticketDetailId;

        await axios.post('/api/v1/payment/canceled', { ticketDetailId });

        const data = await axios.get(`/api/v1/user/${userId}`);

        res.cookie('message', 'Đã hủy thành công');
        res.cookie('type', 'green');

        return res.render('ticketList', { data: data.data });
    } catch (error) {
        res.cookie('message', 'Không thể hủy vé');
        res.cookie('type', 'red');
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
            res.cookie('message', 'Đăng nhập thành công');
            res.cookie('type', 'green');

            return res.redirect('/');
        } catch (error) {
            res.cookie(
                'message',
                'Đăng nhập thất bại, tên đăng nhập hoặc mật khẩu không chính xác'
            );
            res.cookie('type', 'red');
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

            res.cookie('message', 'Đăng ký thành công');
            res.cookie('type', 'green');

            return res.render('logIn');
        } catch (error) {
            res.cookie('message', 'Tên đăng nhập đã được sử dụng');
            res.cookie('type', 'red');
            return res.render('signUp');
        }
    });

// log out
clientRoute.route('/logout').get((req, res) => {
    res.clearCookie('userName');
    res.clearCookie('userId');
    res.cookie('message', 'Đăng xuất thành công');
    res.cookie('type', 'green');
    return res.redirect('/');
});

// get ticket list
clientRoute.route('/user').get(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const data = await axios.get(`/api/v1/user/${userId}`);
        return res.render('ticketList', { data: data.data });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
});

module.exports = clientRoute;
