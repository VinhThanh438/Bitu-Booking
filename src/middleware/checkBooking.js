const { statusCode, message } = require('../constant/response');
const appError = require('../utils/appError');
const pool = require('../config/db.config');

const checkBooking = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const query = `select * from tb_ticket_detail 
            inner join tb_user on tb_ticket_detail.user_id = tb_user.user_id
            where tb_ticket_detail.status = ? and tb_user.user_id = ?`;
        const [getData] = await pool.execute(query, ['booked', userId]);
        console.log(getData[0]);

        const data = getData[0];
        if (data)
            next(
                new appError(
                    statusCode.BAD_REQUEST,
                    'user have an outstanding booking'
                )
            );
        next();
    } catch (error) {
        next(new appError(error));
    }
};

module.exports = { checkBooking };
