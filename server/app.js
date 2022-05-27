require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// routers
const authRouter = require("./src/routes/auth/auth.router");
const profileRouter = require("./src/routes/profile/profile.router");
const productRouter = require("./src/routes/product/product.router");
const providerRouter = require("./src/routes/provider/provider.router");
const adminRouter = require("./src/routes/admin/admin.router");
const orderRouter = require("./src/routes/order/order.router");
const supportRouter = require("./src/routes/support/support.router");
// packages
const morgan = require("morgan");
const fs = require("fs");
const cookieParser = require("cookie-parser");
// middlewares
const errorMiddleware = require("./src/middlewares/errorMiddleware");

app.use(express.json());
app.use(cookieParser(process.env.ACCESS_TOKEN));
app.use(morgan("common", {
    stream: fs.createWriteStream("./src/utils/logs/logs.log", {
        flags: "a"
    })
}));

// endpoints
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/support", supportRouter);
// Endpoint for providers, only for product upload from their side
app.use("/api/v1/provider", providerRouter);

app.use(errorMiddleware);

module.exports = app;


