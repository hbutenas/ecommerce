const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {verifyCookiesMiddleware} = require("../../middlewares/auth/cookies.auth");
const {identifyUserMiddleware} = require("../../middlewares/auth/identification.auth");
const {identifyUserRoleMiddleware} = require("../../middlewares/auth/roles.auth");
const {createProviderController} = require("../../controllers/admin/admin.controller");

router.post("/provider", [
    verifyCookiesMiddleware,
    identifyUserMiddleware,
    identifyUserRoleMiddleware("OWNER", "ADMIN"),
    check("providerName").trim().not().isEmpty().isString(),
], createProviderController);

module.exports = router;