import UsersController from "../../controllers/users";

const {
  allUsers,
  registerUser,
  loginUser,
  updateLoggedInUser,
  getUserSubscriptions,
  getUserDetails,
} = new UsersController();

export const resolver = {
  Query: {
    allUsers: allUsers,
    userSubscriptions: getUserSubscriptions,
    getUserDetails: getUserDetails,
  },

  Mutation: {
    registerUser: registerUser,
    loginUser: loginUser,
    updateLoggedInUser: updateLoggedInUser,
  },
};
