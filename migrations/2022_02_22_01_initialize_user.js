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
                        args: 4,
                        msg: "Username should contain more than 4 characters"
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
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("users");
    }
}