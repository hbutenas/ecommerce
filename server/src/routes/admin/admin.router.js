const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {verifyCookiesMiddleware} = require("../../middlewares/auth/cookies.auth");
const {identifyUserMiddleware} = require("../../middlewares/auth/identification.auth");
const {identifyUserRoleMiddleware} = require("../../middlewares/auth/roles.auth");
const {createProviderController, updateUserProfileController} = require("../../controllers/admin/admin.controller");

router.route("/users/:id").patch([
    verifyCookiesMiddleware,
    identifyUserMiddleware,
    identifyUserRoleMiddleware("OWNER", "ADMIN"),
    check("email").trim().not().isEmpty().isString().optional(),
    check("username").trim().not().isEmpty().isString().optional(),
    check("password").trim().not().isEmpty().isString().optional(),
    check("role").trim().not().isEmpty().isString().optional(),
    check("suspended").trim().not().isEmpty().isBoolean().optional(),
], updateUserProfileController);

router.post("/provider", [
    verifyCookiesMiddleware,
    identifyUserMiddleware,
    identifyUserRoleMiddleware("OWNER", "ADMIN"),
    check("providerName").trim().not().isEmpty().isString(),
], createProviderController);


module.exports = router;