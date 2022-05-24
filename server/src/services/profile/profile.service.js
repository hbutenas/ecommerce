const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const {hashPassword} = require("../../utils/bcrypt/bcrypt.utils");

const getUserProfileService = async (requestUser) => {
    const {email} = requestUser;

    // find and return user profile
    return await prisma.user.findFirst({
        where: {
            email: email.toLowerCase()
        },
        select: {
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            age: true,
        }
    });
};

const updateUserProfileService = async (Request) => {
    const {username, firstName, lastName, age, password} = Request.body;
    const {email} = Request.user;

    const user = await prisma.user.findFirst({
        where: {
            email: email.toLowerCase()
        }
    });

    const hashedPassword = password && await hashPassword(password);

    const updatedUser = await prisma.user.update({
        where: {
            email: email.toLowerCase()
        },
        data: {
            username: username ? username : user.username,
            password: password ? hashedPassword : user.password,
            firstName: firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : user.firstName,
            lastName: lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : user.lastName,
            age: age ? parseInt(age) : user.age
        },
        select: {
            username: true,
            firstName: true,
            lastName: true,
            age: true,
        }
    });

    if (!updatedUser) throw new CustomError.InternalServer("Something went wrong... Please try again later");

    return updatedUser;
};

module.exports = {getUserProfileService, updateUserProfileService};