const { User } = require("../models");

const queryResolver = {
    allUsers: () => {
        return User.findAll();
    }
}

module.exports = queryResolver;