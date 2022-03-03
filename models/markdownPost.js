const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../util/db");

class MarkdownPost extends Model {}
MarkdownPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
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
      validate: {
        min: {
          args: 8,
          msg: "Content should be more than 8 characters",
        },
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    subredditId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "subreddits", key: "id" },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "markdown",
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "markdown_posts",
  }
);

module.exports = MarkdownPost;