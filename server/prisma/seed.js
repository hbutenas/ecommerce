const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const {hashPassword} = require("../src/utils/bcrypt/bcrypt.utils");

async function main() {
    await prisma.user.create({
        data: {
            email: process.env.TEST_OWNER_EMAIL.toLowerCase(),
            username: process.env.TEST_OWNER_USERNAME,
            password: await hashPassword(process.env.TEST_OWNER_PASSWORD),
            role: "OWNER"
        }
    });
    await prisma.user.create({
        data: {
            email: process.env.TEST_CLIENT_EMAIL.toLowerCase(),
            username: process.env.TEST_CLIENT_USERNAME,
            password: await hashPassword(process.env.TEST_CLIENT_PASSWORD),
            role: "CLIENT"
        }
    });
    await prisma.provider.create({
        data: {
            providerName: process.env.TEST_PROVIDER_NAME,
            providerKey: process.env.TEST_PROVIDER_KEY,
            createdBy: "test@gmail.com"
        }
    });
    await prisma.product.create({
        data: {
            productProvider: process.env.TEST_PROVIDER_NAME,
            price: 150.99,
            quantity: 87,
            productName: "GRW300",
            deliveryTime: 14,
            category: "kitchen"
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });