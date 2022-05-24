const CustomError = require("../../errors");

const verifyCookiesMiddleware = async (req, res, next) => {
    const {refresh_token, access_token} = req.cookies;

    if (!refresh_token && !access_token) {
        throw new CustomError.Unauthenticated("Authentication invalid");
    }

    next();
};

module.exports = {verifyCookiesMiddleware};