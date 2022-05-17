const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../util/db");

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(21),
      allowNull: false,
      unique: true,
      validate: {
        // min max validators not working
        min: {
          args: [3],
          msg: "Username should contain more than 3 characters",
        },
        is: {
          args: ["^[a-zA-Z0-9_]+$"],
          msg: 'Usernames cannot have spaces (e.g., "r/username" not "r/user name"), must be between 3-21 characters, and underscores ("_") are the only special characters allowed.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "The provided email is of invalid format.",
        },
      },
    },
    // hashed password
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "user",
  }
);

module.exports = User;
