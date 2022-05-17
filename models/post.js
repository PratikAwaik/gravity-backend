const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../util/db");

class Post extends Model {}
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        // min validator not working
        min: {
          args: 5,
          msg: "Title should be more than 5 characters",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "post",
  }
);

module.exports = Post;
