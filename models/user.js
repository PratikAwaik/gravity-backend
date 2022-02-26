const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../util/db");

class User extends Model {};
User.init({
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
                args: 4,
                msg: "Username should contain more than 4 characters"
            },
            max: {
                args: 21,
                msg: "Username cannot be more than 21 characters"
            }
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
        }
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    icon: {
        type: DataTypes.TEXT, 
        allowNull: true
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "user"
});

module.exports = User;