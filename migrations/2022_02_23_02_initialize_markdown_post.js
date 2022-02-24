const { DataTypes } = require("sequelize");

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("markdown_posts", {
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
                    }
                }
            },
            content: {
                type: DataTypes.TEXT, 
                allowNull: false,
                validate: {
                    min: {
                        args: 8, 
                        msg: "Content should be more than 8 characters",
                    }
                }
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
            created_at: { 
                type: DataTypes.DATE, 
                defaultValue: DataTypes.NOW 
            },
            updated_at: { 
                type: DataTypes.DATE, 
                defaultValue: DataTypes.NOW 
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("markdown_posts");
    }
}