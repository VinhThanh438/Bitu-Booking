const express = require('express');
const axios = require('../../config/axios.config');
const clientRoute = express.Router();

// get home page
clientRoute.route('/').get(async (req, res) => {
    // check user login
    const userId = req.cookies.userId;

    if (userId) {
        const getBookingUrl = await axios.get(`/api/v1/booking-url/${userId}`);

        const ticketDetailId = getBookingUrl.data.ticketDetailId;
        if (ticketDetailId) {
            const getData = await axios.get('/api/v1');
            const data = {
                ticketData: getData.data,
                ticketDetailId: [{ td_id: `/booking/${ticketDetailId.td_id}` }],
            };
            return res.render('home', {
                data: data,
            });
        }
    }

    const getData = await axios.get('/api/v1');
    const data = { ticketData: getData.data, ticketDetailId: [{ td_id: '#' }] };
    return res.render('home', {
        data: data,
    });
});

// booking detail
clientRoute
    .route('/booking/:ticket_id')
    // add booking detail
    .post(async (req, res) => {
        try {
            const userId = req.cookies.userId;
            if (!userId) {
                res.cookie(
                    'message',
                    'Không thể đặt vé, bạn cần đăng nhập để có thể đặt vé!'
                );
                res.cookie('type', 'red');
                return res.redirect('/');
            }
            const ticketId = req.params.ticket_id;

            // create booking detail
            const getBookingData = await axios.post('/api/v1/booking', {
                userId,
                ticketId,
            });

            const bookingId = getBookingData.data.bookingId;

            res.cookie('bookingDetailUrl', `/booking/${ticketId}`);

            // get booking detail after creating
            return res.redirect(`/booking/${bookingId}`);
        } catch (error) {
            if (error.response.status == 503) {
                res.cookie('message', 'Vé đã được đặt hết');
                res.cookie('type', 'red');
                return res.redirect('/');
            }
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
            const oldUrl = req.get('Referer');
            const url = new URL(oldUrl);
            const path = url.pathname;

            // res.cookie('message', 'Tài khoản của bạn không đủ để thanh toán');
            // res.cookie('type', 'red');

            return res.redirect(path);
        } else {
            res.cookie(
                'message',
                'Không thể đặt vé, bạn đã hết thời gian thực hiện thanh toán'
            );
            res.cookie('type', 'red');
            return res.redirect('/');
        }
    }
});

clientRoute.route('/booking/cancel/:ticketDetailId').get(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const ticketDetailId = req.params.ticketDetailId;

        await axios.post('/api/v1/payment/canceled', { ticketDetailId });

        const data = await axios.get(`/api/v1/user/${userId}`);
        // res.cookie('message', 'Đã hủy thành công');
        // res.cookie('type', 'green');

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

// top up user balance
clientRoute.route('/topup').post(async (req, res) => {
    const oldUrl = req.get('Referer');
    const url = new URL(oldUrl);
    const path = url.pathname;

    try {
        const { money } = req.body;
        if (money < 0) return res.redirect(path);
        const userId = req.cookies.userId;
        await axios.post('/api/v1/topup', { money, userId });
        res.cookie('message', 'Nạp tiền thành công');
        res.cookie('type', 'green');
        return res.redirect(path);
    } catch (error) {
        res.cookie('message', 'Nạp tiền không thành công');
        res.cookie('type', 'red');
        return res.redirect(path);
    }
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
