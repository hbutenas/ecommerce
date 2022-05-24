const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {getUserProfileService, updateUserProfileService} = require("../../services/profile/profile.service");

const getUserProfileController = async (req, res) => {
    const response = await getUserProfileService(req.user);
    res.status(StatusCodes.OK).json({response});
};

const updateUserProfileController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }

    const response = await updateUserProfileService(req);
    res.status(StatusCodes.OK).json({response});
};
module.exports = {getUserProfileController, updateUserProfileController};