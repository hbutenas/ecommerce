const express = require("express");
const router = express.Router();
const {check} = require("express-validator");

const {getUserProfileController, updateUserProfileController} = require("../../controllers/profile/profile.controller");
const {verifyCookiesMiddleware} = require("../../middlewares/auth/cookies.auth");
const {identifyUserMiddleware} = require("../../middlewares/auth/identification.auth");
const {identifyUserRoleMiddleware} = require("../../middlewares/auth/roles.auth");

router.route("/")
    .get([verifyCookiesMiddleware, identifyUserMiddleware, identifyUserRoleMiddleware("*")], getUserProfileController)
    .patch([verifyCookiesMiddleware, identifyUserMiddleware, identifyUserRoleMiddleware("*"),
        check("username").trim().not().isEmpty().isLength({
            min: 3
        }).withMessage("Username can't be less than 3 symbols").optional(),
        check("firstName").trim().not().isEmpty().optional(),
        check("lastName").trim().not().isEmpty().optional(),
        check("password").trim().not().isEmpty().isString().isLength({
            min: 6
        }).withMessage("Password has to be at least 6 characters long").optional(),
        check("age").trim().not().isEmpty().isNumeric().isInt({
            min: 3
        }).withMessage("Age can't be less than 0").optional()
    ], updateUserProfileController);

module.exports = router;