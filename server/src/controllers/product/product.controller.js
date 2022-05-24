const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {
    getProductsService,
    getSingleProductService,
    updateProductService
} = require("../../services/product/product.service");

const getProductsController = async (req, res) => {
    const response = await getProductsService();
    res.status(StatusCodes.OK).json({response});
};
const getSingleProductController = async (req, res) => {
    const response = await getSingleProductService(req.params);
    res.status(StatusCodes.OK).json({response});
};
const updateProductController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await updateProductService(req);
    res.status(StatusCodes.OK).json({response});
};

module.exports = {getProductsController, getSingleProductController, updateProductController};