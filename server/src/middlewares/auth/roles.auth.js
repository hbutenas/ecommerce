const CustomError = require("../../errors");

const identifyUserRoleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (roles[0] === "*") {
            next();
        } else if (!roles.includes(req.user.role)) {
            throw new CustomError.Unauthorized("Unauthorized to access this route");
        } else next();
    };
};


module.exports = {identifyUserRoleMiddleware};