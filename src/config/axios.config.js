const getAxios = require('axios');
require('dotenv').config();

const axios = getAxios.create({
    baseURL: `http://localhost:3000`,
    withCredentials: true,
});

module.exports = axios;
