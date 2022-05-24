const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const {toBoolean} = require("validator");

const getProductsService = async () => {
    const products = await prisma.product.findMany({
        where: {
            displayProduct: true
        },
        select: {
            price: true,
            quantity: true,
            productName: true,
            deliveryTime: true,
            category: true,
            productDescription: true,
            isRecommended: true,
        }
    });

    if (products.length <= 0) {
        return {message: "Products does not exists"};
    } else {
        return products;
    }
};

const getSingleProductService = async (requestParams) => {
    const {id} = requestParams;
    const productID = parseInt(id);

    const product = await prisma.product.findFirst({
        where: {
            AND: {
                id: productID,
                displayProduct: true
            }
        },
        select: {
            price: true,
            quantity: true,
            productName: true,
            deliveryTime: true,
            category: true,
            productDescription: true,
            isRecommended: true,
        }
    });

    if (!product) throw new CustomError.BadRequest(`Product with id ${productID} does not exists`);

    return product;
};

const updateProductService = async (Request) => {
    const {id} = Request.params;
    const {displayProduct, productDescription} = Request.body;
    const productID = parseInt(id);

    const productExists = await prisma.product.findFirst({
        where: {
            id: productID
        },
    });

    if (!productExists) throw new CustomError.BadRequest(`Product with id ${productID} does not exists`);

    return await prisma.product.update({
        where: {
            id: productID
        },
        data: {
            displayProduct: toBoolean(displayProduct),
            productDescription,
            confirmedBy: Request.user.email
        }
    });

};
module.exports = {getProductsService, getSingleProductService, updateProductService};