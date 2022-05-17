/* ApolloServer Context */

const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = require("./config");

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null;
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
    const currentUser = await User.findByPk(decodedToken.id);
    return { currentUser };
  }
};

module.exports = context;
