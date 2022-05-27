const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {createOrderService} = require("../../services/order/order.service");

const createOrderController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await createOrderService(req);
    res.status(StatusCodes.CREATED).json({response});
};

module.exports = {createOrderController};