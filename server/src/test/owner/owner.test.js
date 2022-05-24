const request = require("supertest");
const app = require("../../../app");
const expect = require("chai").expect;
const crypto = require("crypto");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

let access_token = "";
const providerDetails = {
    providerName: crypto.randomBytes(3).toString("hex")
};

beforeAll(async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
        email: process.env.TEST_OWNER_EMAIL,
        password: process.env.TEST_OWNER_PASSWORD
    });
    for (const [key, value] of Object.entries(response.headers)) {
        if (key === "set-cookie") {
            expect(value[0]).to.contain("access_token=eyJ");
            expect(value[1]).to.contain("refresh_token=eyJ");
            access_token = value[0];
        }
    }
});

describe("POST /admin/provider", () => {
    it("Should create new provider", async () => {
        const response = await request(app).post("/api/v1/admin/provider").set("Cookie", [access_token]).send({
            providerName: providerDetails.providerName
        });
        expect(response.status).to.equal(201);
    });
});

// Delete provider
afterAll(async () => {
    await prisma.provider.delete({
        where: {
            providerName: providerDetails.providerName
        }
    });
});