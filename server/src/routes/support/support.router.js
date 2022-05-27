const express = require("express");
const router = express.Router();
const {check, query, param} = require("express-validator");
const {verifyCookiesMiddleware} = require("../../middlewares/auth/cookies.auth");
const {identifyUserMiddleware} = require("../../middlewares/auth/identification.auth");
const {identifyUserRoleMiddleware} = require("../../middlewares/auth/roles.auth");
const {getOrdersController, confirmOrderController} = require("../../controllers/support/support.controller");

router.route("/order").get([
    verifyCookiesMiddleware,
    identifyUserMiddleware,
    identifyUserRoleMiddleware("OWNER", "ADMIN", "SUPPORT"),
    query("status").trim().not().isEmpty().isString().withMessage("Query is required to filter successfully orders")
], getOrdersController);

router.route("/order/:id").patch([
    verifyCookiesMiddleware,
    identifyUserMiddleware,
    identifyUserRoleMiddleware("OWNER", "ADMIN", "SUPPORT"),
    param("id").trim().not().isEmpty().withMessage("Query is required to filter successfully orders"),
    check("orderConfirmed").trim().not().isEmpty(),
], confirmOrderController);
module.exports = router;