const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrderService = async (Request) => {
    // productId holds every product as array element, quantity is the same
    const {productId, quantity} = Request.body;
    // quantity cant be 0, product

    const {email} = Request.user;

    // receive a payment here or smt

    let orderValue = 0;
    let productsQuantity = 0;
    for (let i = 0; i < productId.length; i++) {
        // find existing product
        const product = await prisma.product.findFirst({
            where: {
                id: parseInt(productId[i])
            }
        });

        // product does not exists
        if (!product) throw new CustomError.BadRequest(`Product with id ${productId} does not exists`);

        // check for quantity, maybe we are missing products already for some reasons
        if (product.quantity <= 0) throw new CustomError.BadRequest(`Product with id ${productId} is out of stock`);


        // count the order value
        orderValue += product.price * quantity[i];

        // set the quantity
        productsQuantity = product.quantity;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(orderValue.toString().split(".").join("")),
        currency: "eur",
        payment_method: "pm_card_visa",
        confirm: true,
    });

    if (paymentIntent.status !== "succeeded") throw new CustomError.InternalServer("Something went wrong with payment... Please try again later");

    await prisma.order.create({
        data: {
            userEmail: email,
            orderValue,
            paymentId: paymentIntent.id,
            productId,
            avgOrderValue: orderValue / quantity.reduce((a, b) => {
                return a + b;
            }),
            quantity,
        }
    });

    // reduce the product stock quantity
    for (let i = 0; i < productId.length; i++) {
        await prisma.product.update({
            where: {
                id: productId[i]
            },
            data: {
                quantity: productsQuantity - productId[i],
            }
        });
    }

    return {message: "Successfully placed and paid order"};
};

module.exports = {createOrderService};