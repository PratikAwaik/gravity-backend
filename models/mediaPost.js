const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../util/db");

class MediaPost extends Model {}
MediaPost.init(
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
    media: {
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
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "media",
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "media_posts",
  }
);

module.exports = MediaPost;
