const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const crypto = require("crypto");

/* Providers starts */

const createProviderService = async (Request) => {
    const {providerName} = Request.body;
    const {email} = Request.user;

    return await prisma.provider.create({
        data: {
            providerName,
            providerKey: crypto.randomBytes(15).toString("hex"),
            createdBy: email
        },
        select: {
            providerName: true,
            providerKey: true,
            createdBy: true
        }
    });
};

/* Providers ends */

module.exports = {createProviderService};