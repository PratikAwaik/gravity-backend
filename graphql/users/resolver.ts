import UsersController from "../../controllers/users";

const {
  getAllUsers,
  registerUser,
  loginUser,
  updateLoggedInUser,
  getUserSubscriptions,
  getUserDetails,
} = new UsersController();

export const resolver = {
  Query: {
    getAllUsers: getAllUsers,
    userSubscriptions: getUserSubscriptions,
    getUserDetails: getUserDetails,
  },

  Mutation: {
    registerUser: registerUser,
    loginUser: loginUser,
    updateLoggedInUser: updateLoggedInUser,
  },
};
