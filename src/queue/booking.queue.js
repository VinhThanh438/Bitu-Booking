const Bull = require('bull');
const axios = require('../config/axios.config');

const bookingQueue = new Bull('booking-queue', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});

bookingQueue.process(async (job) => {
    try {
        const { userId, ticketId } = job.data;
        const bookingData = await axios.post('/api/v1/booking', {
            userId,
            ticketId,
        });
        return bookingData.data;
    } catch (error) {
        console.log(error);
    }
});

module.exports = bookingQueue;
