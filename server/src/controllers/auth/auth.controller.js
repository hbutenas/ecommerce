const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {registerUserService, loginUserService, logoutUserService} = require("../../services/auth/auth.service");

const registerUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await registerUserService(req.body);
    res.status(StatusCodes.CREATED).json({response});
};

const loginUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await loginUserService(req, res);
    res.status(StatusCodes.OK).json({response});

};

const logoutUserController = async (req, res) => {
    const response = await logoutUserService(res);
    res.status(StatusCodes.OK).json({response});
};

module.exports = {registerUserController, loginUserController, logoutUserController};