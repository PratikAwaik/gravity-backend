const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("subreddits", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(21),
        allowNull: false,
        unique: true,
        validate: {
          // min validators not working
          min: {
            args: 3,
            msg: "Community name should be more than 3 characters",
          },
        },
      },
      prefixed_name: {
        type: DataTypes.STRING(23),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          // min validator not working
          min: {
            args: 10,
            msg: "Description of the community should not be less than 10 characters",
          },
        },
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
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
    await queryInterface.dropTable("subreddits");
  },
};
