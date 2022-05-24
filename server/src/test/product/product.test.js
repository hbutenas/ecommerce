const request = require("supertest");
const app = require("../../../app");
const expect = require("chai").expect;


describe("GET /product", () => {
    it("Should receive all products which are displayed", async () => {
        const response = await request(app).get("/api/v1/product");
        expect(response.status).to.equal(200);
    });
});