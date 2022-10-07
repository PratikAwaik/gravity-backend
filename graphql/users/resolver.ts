import UsersController from "../../controllers/users";

const { allUsers, registerUser, loginUser } = new UsersController();

export const resolver = {
  Query: {
    allUsers: allUsers,
  },

  Mutation: {
    registerUser: registerUser,
    loginUser: loginUser,
  },
};
