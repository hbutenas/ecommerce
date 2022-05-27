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
    const {id: productID} = requestParams;

    const product = await prisma.product.findFirst({
        where: {
            AND: {
                id: parseInt(productID),
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
    const {id: productID} = Request.params;
    const {displayProduct, productDescription} = Request.body;

    const productExists = await prisma.product.findFirst({
        where: {
            id: parseInt(productID)
        },
    });

    if (!productExists) throw new CustomError.BadRequest(`Product with id ${productID} does not exists`);

    return await prisma.product.update({
        where: {
            id: parseInt(productID)
        },
        data: {
            displayProduct: toBoolean(displayProduct),
            productDescription,
            confirmedBy: Request.user.email
        }
    });

};
module.exports = {getProductsService, getSingleProductService, updateProductService};