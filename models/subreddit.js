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
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        min: {
          args: 3,
          msg: "Community name should be more than 3 characters",
        },
        max: {
          args: 21,
          msg: "Community name should be less than 21 characters",
        },
      },
    },
    prefixedName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: function () {
        return "r/" + this.name;
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
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
