const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");

const createProductsService = async (Request) => {
    const {providerKey, products} = Request.body;

    const provider = await prisma.provider.findFirst({
        where: {
            providerKey
        }
    });

    if (!provider) throw new CustomError.Unauthenticated("Unrecognized provider key provided");

    const requiredKeys = ["price", "quantity", "productName", "deliveryTime", "category"];

    for (let i = 0; i < products.length; i++) {
        let matchingKeys = !requiredKeys.some(e => !Object.keys(products[i]).includes(e));

        // missing product property
        if (!matchingKeys) {
            throw new CustomError.BadRequest(`${i} index product is missing property`);
        }

        // product price is too low
        if (products[i].price <= 50) {
            throw new CustomError.BadRequest(`${i} index product price is too low`);
        }

        // find for already existing product
        const existingProducts = await prisma.product.findFirst({
            where: {
                productName: products[i].productName
            }
        });

        if (existingProducts) throw new CustomError.BadRequest(`${i} index product already exists. Update or delete existing product first`);

        // insert products
        await prisma.product.create({
            data: {
                productProvider: provider.providerName,
                price: products[i].price + (products[i].price * (parseFloat(process.env.PVM_COST) + parseFloat(process.env.TRANSPORTATION_COST))),
                quantity: products[i].quantity,
                productName: products[i].productName,
                deliveryTime: products[i].deliveryTime,
                category: products[i].category,
                isRecommended: products[i].deliveryTime <= 14
            },
        });
    }
    return {message: "Products successfully uploaded"};
};

module.exports = {createProductsService};