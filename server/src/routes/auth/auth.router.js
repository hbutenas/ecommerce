const express = require("express");
const router = express.Router();
const {check} = require("express-validator");

const {
    registerUserController,
    loginUserController,
    logoutUserController
} = require("../../controllers/auth/auth.controller");

router.post("/register", [
    check("email").trim().not().isEmpty().isEmail(),
    check("username").trim().not().isEmpty().isString(),
    check("password").trim().not().isEmpty().isString().isLength({
        min: 6
    }).withMessage("Password has to be at least 6 characters long"),
    check("firstName").optional().trim().not().isEmpty().isString(),
    check("lastName").optional().trim().not().isEmpty().isString(),
    check("age").optional().trim().not().isEmpty().isNumeric().isInt({
        min: 0
    }).withMessage("Age can't be less than 0"),
], registerUserController);

router.post("/login", [
    check("email").trim().not().isEmpty().isEmail(),
    check("password").trim().not().isEmpty().isString()
], loginUserController);

router.post("/logout", logoutUserController);

module.exports = router;