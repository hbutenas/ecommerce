const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {getOrdersService, confirmOrderService} = require("../../services/support/support.service");

const getOrdersController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }


    const response = await getOrdersService(req.query);
    res.status(StatusCodes.OK).json({response});
};

const confirmOrderController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await confirmOrderService(req);
    res.status(StatusCodes.OK).json({response});
};
module.exports = {getOrdersController, confirmOrderController};