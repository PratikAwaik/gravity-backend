const { DataTypes } = require("sequelize");

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("media_posts", {
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
                        msg: "Title should be more than 5 characters"
                    },
                    max: {
                        args: 300,
                        msg: "Title should not be more than 300 characters"
                    }
                }
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
                references: { model: "subreddits", key: "id" }
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "media",
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
        await queryInterface.dropTable("media_posts");
    }
}