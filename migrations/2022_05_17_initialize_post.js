const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("posts", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: {
          // min max validators not working
          min: {
            args: 5,
            msg: "Title should be more than 5 characters",
          },
          max: {
            args: 300,
            msg: "Title should not be more than 300 characters",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      subreddit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "subreddits", key: "id" },
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
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
    await queryInterface.dropTable("posts");
  },
};
