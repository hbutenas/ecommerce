const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../../errors");
const {hashPassword, validatePassword} = require("../../utils/bcrypt/bcrypt.utils");
const {assignCookiesToResponse, deleteCookiesFromResponse} = require("../../utils/jwt/jwt.utils");

const registerUserService = async (requestBody) => {
    const {email, username, password, firstName, lastName, age} = requestBody;

    // check for existing user
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email.toLowerCase()
        }
    });

    if (existingUser) throw new CustomError.BadRequest("Email address is already taken");

    // generate password hash
    const hashedPassword = await hashPassword(password);

    // get all records
    const users = await prisma.user.findMany({});

    const newUser = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            username,
            password: hashedPassword,
            firstName: firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : null,
            lastName: lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : null,
            role: users.length > 0 ? "CLIENT" : "OWNER",
            age: age ? age : null,
        },
        select: {
            email: true,
            username: true,
            role: true
        }
    });

    if (!newUser) throw new CustomError.InternalServer("Something went wrong... Please try again later");

    return newUser;
};

const loginUserService = async (Request, Response) => {
    const {email, password} = Request.body;

    // check for existing user
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email.toLowerCase()
        }
    });

    if (!existingUser) throw new CustomError.BadRequest("Email address or password is incorrect");

    // user account is disabled
    if (existingUser.suspended) throw new CustomError.BadRequest("Email address or password is incorrect");

    // compare passwords
    const isPasswordMatching = await validatePassword(password, existingUser.password);

    // password does not match
    if (!isPasswordMatching) throw new CustomError.BadRequest("Email address or password is incorrect");

    // create user payload
    const userPayload = {
        user_id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
    };

    await assignCookiesToResponse(userPayload, Response);

    return userPayload;
};

const logoutUserService = async (Response) => {
    await deleteCookiesFromResponse(Response);
    return {message: "User successfully logged out"};
};

module.exports = {registerUserService, loginUserService, logoutUserService};
