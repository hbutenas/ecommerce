const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const {toBoolean} = require("validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getOrdersService = async (requestQuery) => {
    const {status} = requestQuery;
    const orders = await stripe.paymentIntents.list({});
    let succeededOrders = [];

    for (let i = 0; i < orders.data.length; i++) {
        if (orders.data[i].charges.data[0].status === "succeeded") {
            // Find the orders which are paid, but still with PENDING status
            const order = await prisma.order.findFirst({
                where: {
                    AND: [
                        {
                            orderStatus: status,
                            paymentId: orders.data[i].id
                        }

                    ]
                }
            });
            succeededOrders.push(order);
        }
    }
    return succeededOrders.filter(e => e).length > 0 ? succeededOrders.filter(e => e) : {message: "There are no orders at the moment"};
};

const confirmOrderService = async (Request) => {
    const {id: orderId} = Request.params;
    const {orderConfirmed} = Request.body;
    const {email} = Request.user;
    //find the order
    const order = await prisma.order.findFirst({
        where: {
            id: parseInt(orderId)
        }
    });

    if (!order) throw new CustomError.BadRequest(`Order with id ${orderId} does not exists`);

    if (toBoolean(orderConfirmed)) {
        await prisma.order.update({
            where: {
                id: parseInt(orderId)
            },
            data: {
                orderStatus: "CONFIRMED",
                orderConfirmed: toBoolean(orderConfirmed),
                confirmedBy: email
            }
        });
    }

    return {message: "Order successfully confirmed"};
};
module.exports = {getOrdersService, confirmOrderService};