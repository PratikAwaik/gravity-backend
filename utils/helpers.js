const removePasswordFromUser = (user) => {
  delete user.password;
  return user;
};

module.exports = {
  removePasswordFromUser,
};
