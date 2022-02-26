const { DataTypes } = require("sequelize");

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("subreddits", {
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
                        msg: "Community name should be more than 3 characters"
                    },
                    max: {
                        args: 21,
                        msg: "Community name should be less than 21 characters"
                    }
                }
            },
            prefixed_name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    min: {
                        args: 10,
                        msg: "Description of the community should not be less than 10 characters"
                    }
                }
            },
            icon: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            admin_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" }
            },
            created_at: { 
                type: DataTypes.DATE, 
                defaultValue: DataTypes.NOW 
            },
            updated_at: { 
                type: DataTypes.DATE, 
                allowNull: true,
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("subreddits");
    }
}