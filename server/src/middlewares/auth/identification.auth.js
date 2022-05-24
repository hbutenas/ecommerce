const CustomError = require("../../errors");
const {verifyJwtToken, assignCookiesToResponse} = require("../../utils/jwt/jwt.utils");

const identifyUserMiddleware = async (req, res, next) => {
    const {refresh_token, access_token} = req.cookies;

    // just to be sure if for some reasons first middleware fails
    if (!refresh_token && !access_token) {
        throw new CustomError.Unauthenticated("Authentication invalid");
    }

    if (access_token) {
        const user = await verifyJwtToken(access_token, process.env.ACCESS_TOKEN);

        if (!user) {
            throw new CustomError.Unauthenticated("Authentication invalid");
        } else {
            req.user = user;
            next();
        }
    } else if (refresh_token) {
        const user = await verifyJwtToken(refresh_token, process.env.REFRESH_TOKEN);

        if (!user) {
            throw new CustomError.Unauthenticated("Authentication invalid");
        } else {
            const userPayload = {
                user_id: user.id,
                email: user.email,
                role: user.role,
            };

            // renew access token
            await assignCookiesToResponse(userPayload, res);

            // create user object on request
            req.user = user;
            next();
        }
    }
};

module.exports = {identifyUserMiddleware};