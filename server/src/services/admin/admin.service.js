const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const crypto = require("crypto");
const {hashPassword} = require("../../utils/bcrypt/bcrypt.utils");

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

/* Users starts */
// todo padaryt suspend, kad neveiktu prisijungimas
/// updates user from admin side
const updateUserProfileService = async (Request) => {
    const {id: userID} = Request.params;
    const {email, username, password, role, suspended} = Request.body;

    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(userID)
        }
    });

    // couldn't find any user with provided id
    if (!user) throw new CustomError.BadRequest(`User with id ${userID} does not exists`);

    // if someone wants to modify the owner profile, reject it
    if (user.role === "OWNER") throw new CustomError.BadRequest(`User with id ${userID} does not exists`);

    // update user
    const updatedUser = await prisma.user.update({
        where: {
            id: parseInt(userID)
        },
        data: {
            email: email ? email : user.email,
            username: username ? username : user.username,
            password: password ? await hashPassword(password) : user.password,
            role: role ? role : user.role,
            suspended: suspended ? suspended : user.suspended,
        }
    });

    if (!updatedUser) throw new CustomError.BadRequest("Something went wrong... Please try again late");

    return updatedUser;
};
/* Users ends */


module.exports = {createProviderService, updateUserProfileService};