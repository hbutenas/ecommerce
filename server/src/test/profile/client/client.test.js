const request = require("supertest");
const app = require("../../../../app");
const expect = require("chai").expect;
const {hashPassword} = require("../../../utils/bcrypt/bcrypt.utils");
const crypto = require("crypto");
let access_token = "";

beforeAll(async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
        email: process.env.TEST_CLIENT_EMAIL,
        password: process.env.TEST_CLIENT_PASSWORD
    });
    for (const [key, value] of Object.entries(response.headers)) {
        if (key === "set-cookie") {
            expect(value[0]).to.contain("access_token=eyJ");
            expect(value[1]).to.contain("refresh_token=eyJ");
            access_token = value[0];
        }
    }
});

describe("GET /profile", () => {
    it("Should receive user profile", async () => {
        const response = await request(app).get("/api/v1/profile").set("Cookie", [access_token]);
        expect(response.status).to.equal(200);
    });
});

// Can't update username/password, because this is seeded data and other tests will fail on it
// If successfully these fields changes - everything will be ok with others
describe("PATCH /profile", () => {
    it("Should update users profile fields", async () => {
        const user = {
            firstName: crypto.randomBytes(5).toString("hex"),
            lastName: crypto.randomBytes(5).toString("hex"),
            age: Math.floor(Math.random() * 99),
        };

        const response = await request(app).patch("/api/v1/profile").set("Cookie", [access_token]).send({
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
        });

        expect(response.status).to.equal(200);
    });
});