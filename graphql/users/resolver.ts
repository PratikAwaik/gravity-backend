import UsersController from "../../controllers/users";

const {
  allUsers,
  registerUser,
  loginUser,
  updateLoggedInUser,
  getUserSubscriptions,
} = new UsersController();

export const resolver = {
  Query: {
    allUsers: allUsers,
    userSubscriptions: getUserSubscriptions,
  },

  Mutation: {
    registerUser: registerUser,
    loginUser: loginUser,
    updateLoggedInUser: updateLoggedInUser,
  },
};
