const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { User } = require("../models");
const { JWT_SECRET } = require("../util/config");

const hash = (password) => {
  return bcrypt.hash(password, 10);
};

const createNewUser = async (_, args) => {
  try {
    const passwordHash = await hash(args.password);
    const user = await User.create({ ...args, password: passwordHash });
    const userForToken = {
      username: user.username,
      id: user.id,
    };
    const token = jwt.sign(userForToken, JWT_SECRET);
    return { ...user.toJSON(), token: { value: token } };
  } catch (error) {
    const err = error.errors[0];
    throw new UserInputError(err.message, {
      invalidArgs: err.path,
    });
  }
};

const loginUser = async (_, args) => {
  const user = await User.findOne({
    where: {
      username: args.username,
    },
  });

  const isPasswordCorrect = user
    ? await bcrypt.compare(args.password, user.password)
    : false;

  if (!isPasswordCorrect) {
    throw new UserInputError("Invalid username or password", {
      invalidArgs: args,
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, JWT_SECRET);
  return { value: token };
};

module.exports = {
  createNewUser,
  loginUser,
};
