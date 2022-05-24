const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {createProductsController} = require("../../controllers/provider/provider.controller");

router.post("/", [
    check("providerKey").not().isEmpty().isString(),
    check("products").not().isEmpty().isArray({min: 1}).withMessage("There can't be less than 1 product provided"),
], createProductsController);

module.exports = router;