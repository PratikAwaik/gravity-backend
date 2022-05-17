const mutationController = require("../controllers/mutation");

const mutationResolver = {
  createNewUser: mutationController.createNewUser,
  loginUser: mutationController.loginUser,
  createNewSubreddit: mutationController.createNewSubreddit,
};

module.exports = mutationResolver;
