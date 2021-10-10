const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
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
  await postUser.save();

  // add post in subreddit
  // const Subreddit = this.model("Subreddit");
  // const postSubreddit = await Subreddit.findById(doc.subreddit);
  // postSubreddit.posts = postSubreddit.posts.concat(doc._id);
  // await postSubreddit.save();
});

PostSchema.post("findOneAndDelete", async function (doc) {
  // cleanUp here
  // TODO: add usersUpvoted in Post model
});

module.exports = mongoose.model("Post", PostSchema);
