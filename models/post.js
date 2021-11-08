const mongoose = require("mongoose");
const helpers = require("../utils/helpers");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title to your post."],
    maxlength: 300,
  },
  content: {
    type: String,
  },
  subreddit: {
    type: Schema.Types.ObjectId,
    ref: "Subreddit",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

PostSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

PostSchema.post("save", async function (doc) {
  // add post in user.posts
  const User = this.model("User");
  const postUser = await User.findById(doc.user);
  postUser.posts = postUser.posts.concat(doc._id);
  await User.findByIdAndUpdate(doc.user, { posts: postUser.posts });

  // add post in subreddit
  const Subreddit = this.model("Subreddit");
  const postSubreddit = await Subreddit.findById(doc.subreddit);
  postSubreddit.posts = postSubreddit.posts.concat(doc._id);
  await Subreddit.findByIdAndUpdate(doc.subreddit, {
    posts: postSubreddit.posts,
  });
});

PostSchema.post("findOneAndDelete", async function (doc) {
  const Comment = doc.model("Comment");
  const User = doc.model("User");
  const Subreddit = doc.model("Subreddit");

  // remove comments from user
  await removeCommentsFromUser(doc, User, Comment);

  // remove post from users
  await removePostFromUsers(doc, User);

  // remove post from subreddit
  const subreddit = await Subreddit.findById(doc.subreddit);
  subreddit.posts = helpers.filteredArray(subreddit.posts, doc._id);
  await Subreddit.findByIdAndUpdate(doc.subreddit, { posts: subreddit.posts });
});

async function removeCommentsFromUser(post, User, Comment) {
  for (const commentId of post.comments) {
    await Comment.findByIdAndDelete(commentId);
  }
}

async function removePostFromUsers(post, User) {
  const users = await User.find({});

  for (const user of users) {
    user.posts = helpers.filteredArray(user.posts, post._id);
    user.postsUpvoted = helpers.filteredArray(user.postsUpvoted, post._id);
    user.postsDownvoted = helpers.filteredArray(user.postsDownvoted, post._id);
    await User.findByIdAndUpdate(user._id, {
      posts: user.posts,
      postsUpvoted: user.postsUpvoted,
      postsDownvoted: user.postsDownvoted,
    });
  }
}

module.exports = mongoose.model("Post", PostSchema);
