const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {createProviderService} = require("../../services/admin/admin.service");

const createProviderController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await createProviderService(req);
    res.status(StatusCodes.CREATED).json({response});

};

module.exports = {createProviderController};