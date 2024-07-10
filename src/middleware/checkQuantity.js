const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const checkQuantity = async (req, res, next) => {
    try {
        const { ticketId } = req.body;

        const query = `select quantity from tb_ticket where ticket_id = ?`;

        const [getData] = await pool.execute(query, [ticketId]);

        const data = getData[0];
        if (data.quantity <= 0) {
            next(
                new appError(
                    statusCode.SERVICE_UNAVAILABLE,
                    'Tickets are fully booked'
                )
            );
        }
        next();
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = { checkQuantity };
