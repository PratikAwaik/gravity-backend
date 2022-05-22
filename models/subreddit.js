const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../util/db");

class Subreddit extends Model {}
Subreddit.init(
  {
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
        // min max validators not working
        min: {
          args: 3,
          msg: "Community name should be more than 3 characters",
        },
        is: {
          args: ["^[a-zA-Z0-9_]+$"],
          msg: 'Names cannot have spaces (e.g., "r/bookclub" not "r/book club"), must be between 3-21 characters, and underscores ("_") are the only special characters allowed.',
        },
      },
    },
    prefixedName: {
      type: DataTypes.STRING(23),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(350),
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
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "subreddit",
  }
);

module.exports = Subreddit;
