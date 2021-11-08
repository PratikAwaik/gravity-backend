const mongoose = require("mongoose");
const helpers = require("../utils/helpers");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, "How can you not comment anything? Write something :/"],
    minlength: 3,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  repliedTo: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
  editedAt: {
    type: Date,
  },
});

CommentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

CommentSchema.post("save", async function (doc) {
  const Post = this.model("Post");
  const User = this.model("User");
  // save comment in post
  const post = await Post.findById(doc.post);
  await Post.findByIdAndUpdate(doc.post, {
    comments: post.comments.concat(doc._id),
  });

  // save comment in user
  const user = await User.findById(doc.user);
  await User.findByIdAndUpdate(doc.user, {
    comments: user.comments.concat(doc._id),
  });
});

CommentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Post = doc.model("Post");
    const User = doc.model("User");

    // remove comment from user
    const user = await User.findById(doc.user);
    user.comments = helpers.filteredArray(user.comments, doc._id);
    user.commentsUpvoted = helpers.filteredArray(user.commentsUpvoted, doc._id);
    user.commentsDownvoted = helpers.filteredArray(
      user.commentsDownvoted,
      doc._id
    );
    await User.findByIdAndUpdate(doc.user, {
      comments: user.comments,
      commentsUpvoted: user.commentsUpvoted,
      commentsDownvoted: user.commentsDownvoted,
    });
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
