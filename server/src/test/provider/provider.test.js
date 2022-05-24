const request = require("supertest");
const app = require("../../../app");
const expect = require("chai").expect;
const crypto = require("crypto");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const categoryList = ["bathroom", "kitchen", "office", "living room"];
const productDetails = {
    productProvider: process.env.TEST_PROVIDER_NAME,
    price: Math.floor(Math.random() * 1000) + 100,
    quantity: Math.floor(Math.random() * 1000) + 1,
    productName: crypto.randomBytes(5).toString("hex"),
    deliveryTime: Math.floor(Math.random() * 50) + 1,
    category: categoryList[Math.floor(Math.random() * 3) + 0],
};


// This test is written for testing the successful product upload from provider side
describe("POST /provider", () => {
    it("Should create n amount of products", async () => {
        const response = await request(app).post("/api/v1/provider").send({
            providerKey: process.env.TEST_PROVIDER_KEY,
            products: [
                productDetails
            ]
        });
        console.log(response);
        // expect(response.status).to.equal(201);
    });
});

// Delete product
afterAll(async () => {
    await prisma.product.delete({
        where: {
            productName: productDetails.productName
        }
    });
});