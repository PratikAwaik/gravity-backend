const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
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

// CommentSchema.post("save", async function (doc) {
//   const Post = this.model("Post");
//   const User = this.model("User");
//   // save comment in post
//   const post = await Post.findById(doc.post);
//   post.comments = post.comments.concat(doc._id);
//   await post.save();

//   // save comment in user
//   const user = await User.findById(doc.user);
//   await User.findByIdAndUpdate(doc.user, {
//     comments: user.comments.concat(doc._id),
//   });
// });

// CommentSchema.post("remove", async function (doc) {
//   const Post = doc.model("Post");
//   const User = doc.model("User");
//   // remove comment from post
//   const post = await Post.findById(doc.post);
//   post.comments = post.comments.filter(
//     (comment) => comment.toString() !== doc.id.toString()
//   );
//   await post.save();

//   // remove comment from user
//   const user = await User.findById(doc.user);
//   const comments = user.comments.filter(
//     (comment) => comment.toString() !== doc.id.toString()
//   );
//   await User.findByIdAndUpdate(doc.user, { comments });
// });

module.exports = mongoose.model("Comment", CommentSchema);
