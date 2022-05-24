const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {createProductsService} = require("../../services/provider/provider.service");

const createProductsController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await createProductsService(req);
    res.status(StatusCodes.CREATED).json({response});
};

module.exports = {createProductsController};