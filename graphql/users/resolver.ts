import UserController from "../../controllers/users";

export const resolver = {
  Query: {
    allUsers: UserController.allUsers,
  },

  Mutation: {
    registerUser: UserController.registerUser,
    loginUser: UserController.loginUser,
  },
};
