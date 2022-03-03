const mutationController = require("../controllers/mutation");

const mutationResolver = {
  createNewUser: mutationController.createNewUser,
  loginUser: mutationController.loginUser,
};

module.exports = mutationResolver;
