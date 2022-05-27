const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {verifyCookiesMiddleware} = require("../../middlewares/auth/cookies.auth");
const {identifyUserMiddleware} = require("../../middlewares/auth/identification.auth");
const {identifyUserRoleMiddleware} = require("../../middlewares/auth/roles.auth");
const {createOrderController} = require("../../controllers/order/order.controller");

router.route("/").post([
    verifyCookiesMiddleware,
    identifyUserMiddleware,
    identifyUserRoleMiddleware("*"),
    check("productId").isArray({min: 1}),
    check("quantity").isArray({min: 1}),
], createOrderController);

module.exports = router;