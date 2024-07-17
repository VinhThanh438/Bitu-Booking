const Bull = require('bull');
const pool = require('../config/db.config');

const autoCancelQueue = new Bull('auto-cancel-queue', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});

autoCancelQueue.process((job, done) => {
    try {
        setTimeout(async () => {
            const { bookingId } = job.data;
            const query =
                'delete from tb_ticket_detail where td_id = ? and status = ?';
            await pool.execute(query, [bookingId, 'booked']);
        }, 60 * 1000);
    } catch (error) {
        console.log(error);
    }
});

module.exports = autoCancelQueue;
