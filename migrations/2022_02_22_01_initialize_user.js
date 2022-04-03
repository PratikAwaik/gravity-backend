const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          min: {
            args: 3,
            msg: "Username should contain more than 3 characters",
          },
          max: {
            args: 21,
            msg: "Username cannot be more than 21 characters",
          },
          is: ["^[a-zA-Z0-9_]+$"],
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          min: {
            args: 7,
            msg: "Email should contain more than 7 characters",
          },
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      profile_pic: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("users");
  },
};
