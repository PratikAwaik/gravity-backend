const bcrypt = require("bcryptjs");
const { UserInputError } = require("sequelize");
const { User } = require("../models");

const hash = (password) => {
    return bcrypt.hash(password, 10);
}

const mutationResolver = {
    createNewUser: async (_, args) => {
        try {
            const passwordHash = await hash(args.password);
            const user = await User.create({ ...args, password: passwordHash });
            return user;
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = mutationResolver;