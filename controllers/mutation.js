const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { User, Subreddit } = require("../models");
const { JWT_SECRET } = require("../util/config");

const hash = (password) => {
  return bcrypt.hash(password, 10);
};

const throwError = (errorType, errorMessage, options) => {
  throw new errorType(errorMessage, options);
};

const validateUserDetails = (args) => {
  if (args.password.length < 5) {
    throwError(UserInputError, "Password must contain more than 5 characters.");
  } else if (args.username.length < 3) {
    throwError(
      UserInputError,
      "Username should contain more than 3 characters"
    );
  } else if (args.username.length > 21) {
    throwError(UserInputError, "Username cannot be more than 21 characters");
  }
};

const validateSubredditDetails = (args, context) => {
  if (!context.currentUser) {
    throwError(AuthenticationError, "Login Required to create a community");
  } else if (args.name.length < 3) {
    throwError(
      UserInputError,
      "Community name should be more than 3 characters"
    );
  } else if (args.name.length > 21) {
    throwError(
      UserInputError,
      "Community name should be less than 21 characters"
    );
  } else if (args.description.length < 10) {
    throwError(
      UserInputError,
      "Description of the community should not be less than 10 characters"
    );
  }
};

const createNewUser = async (_, args) => {
  validateUserDetails(args);
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
    const err = error.errors ? error.errors[0] : error;
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
    throwError(UserInputError, "Invalid username or password", {
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

const createNewSubreddit = async (_, args, context) => {
  validateSubredditDetails(args, context);
  try {
    const subreddit = await Subreddit.create({
      ...args,
      prefixedName: "r/" + args.name,
      adminId: context.currentUser.id,
    });
    return subreddit;
  } catch (error) {
    const err = error.errors ? error.errors[0] : error;
    throwError(UserInputError, err.message, { invalidArgs: args });
  }
};

module.exports = {
  createNewUser,
  loginUser,
  createNewSubreddit,
};
