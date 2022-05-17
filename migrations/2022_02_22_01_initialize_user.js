const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("users", {
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
          // min validator not working
          min: {
            args: [3],
            msg: "Username should contain more than 3 characters",
          },
          is: ["^[a-zA-Z0-9_]+$"],
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
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
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
