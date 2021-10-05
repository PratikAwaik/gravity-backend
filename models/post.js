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
  type: {
    type: String,
    required: true,
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
  const User = this.model("User");
  const user = await User.findById(doc.user);
  await User.findByIdAndUpdate(doc.user, { posts: user.posts.concat(doc._id) });
});

PostSchema.post("findOneAndDelete", async function (doc) {
  const Comment = doc.model("Comment");
  const User = doc.model("User");
  await Comment.deleteMany({ post: doc._id });
  const updatedUser = await updateUser(User, doc.user, doc._id, doc.comments);
  await User.findByIdAndUpdate(doc.user, updatedUser);
});

async function updateUser(User, userId, postId, postComments) {
  const user = await User.findById(userId);
  return {
    posts: user.posts.filter((post) => post.toString() !== postId.toString()),
    postsUpvoted: user.postsUpvoted.filter(
      (post) => post.toString() !== postId.toString()
    ),
    postsDownvoted: user.postsDownvoted.filter(
      (post) => post.toString() !== postId.toString()
    ),
    comments: user.comments.filter(
      (comment) => postComments.indexOf(comment) < 0
    ),
    commentsUpvoted: user.commentsUpvoted.filter(
      (comment) => postComments.indexOf(comment) < 0
    ),
    commentsDownvoted: user.commentsDownvoted.filter(
      (comment) => postComments.indexOf(comment) < 0
    ),
  };
}

module.exports = mongoose.model("Post", PostSchema);
