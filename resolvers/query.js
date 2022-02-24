const { User, Subreddit, MarkdownPost } = require("../models");

const queryResolver = {
    allUsers: () => {
        return User.findAll();
    },
    allSubreddits: async () => {
        const subreddits = await Subreddit.findAll({
            include: { model: User, as: "admin", attributes: { exclude: ["markdownPostId"] } },
            attributes: {
                exclude: ["userId", "markdownPostId"]
            }
        });
        return subreddits; 
    },
    allMarkdownPosts: () => {
        return MarkdownPost.findAll({
            include: [
                {
                    model: User,
                    as: "author",
                }, 
                {
                    model: Subreddit,
                    attributes: { exclude: ["userId"] }
                }
            ],
            attributes: { exclude: ["userId"] },
        });
    }
}

module.exports = queryResolver;