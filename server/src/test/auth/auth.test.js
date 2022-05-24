const request = require("supertest");
const app = require("../../../app");
const expect = require("chai").expect;
const crypto = require("crypto");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const testUserCredentials = {
    email: crypto.randomBytes(5).toString("hex") + "@gmail.com",
    username: crypto.randomBytes(5).toString("hex"),
    password: crypto.randomBytes(5).toString("hex")
};


describe("POST /register", () => {
    it("Should create a new user", async () => {
        const response = await request(app).post("/api/v1/auth/register").send(testUserCredentials);
        expect(response.status).to.equal(201);
    });
});


describe("POST /login", () => {
    it("Should successfully login and receive 2 tokens - ACCESS_TOKEN / REFRESH_TOKEN", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
            email: testUserCredentials.email,
            password: testUserCredentials.password
        });
        for (const [key, value] of Object.entries(response.headers)) {
            if (key === "set-cookie") {
                expect(value[0]).to.contain("access_token=eyJ");
                expect(value[1]).to.contain("refresh_token=eyJ");
            }
        }
    });
});

describe("POST /logout", () => {
    it("Should successfully log out and should not have anymore of tokens - ACCESS_TOKEN / REFRESH_TOKEN", async () => {
        const response = await request(app).post("/api/v1/auth/logout");
        for (const [key, value] of Object.entries(response.headers)) {
            if (key === "set-cookie") {
                expect(value[0]).to.contain("access_token=;");
                expect(value[1]).to.contain("refresh_token=;");
            }
        }
    });
});

// Delete test user
afterAll(async () => {
    await prisma.user.delete({
        where: {
            email: testUserCredentials.email
        }
    });
});

