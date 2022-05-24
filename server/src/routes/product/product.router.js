const express = require("express");
const router = express.Router();
const {check, param} = require("express-validator");

const {verifyCookiesMiddleware} = require("../../middlewares/auth/cookies.auth");
const {identifyUserMiddleware} = require("../../middlewares/auth/identification.auth");
const {identifyUserRoleMiddleware} = require("../../middlewares/auth/roles.auth");
const {
    getProductsController,
    getSingleProductController,
    updateProductController
} = require("../../controllers/product/product.controller");

router.route("/").get(getProductsController);
router.route("/:id")
    .get(getSingleProductController)
    .patch([
        verifyCookiesMiddleware,
        identifyUserMiddleware,
        identifyUserRoleMiddleware("OWNER", "ADMIN", "PRODUCT"),
        param("id").trim().not().isEmpty().isInt({min: 0}),
        check("displayProduct").trim().not().isEmpty().isBoolean(),
        check("productDescription").trim().not().isEmpty().isString(),
    ], updateProductController);

module.exports = router;