const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subreddit",
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  postsUpvoted: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  postsDownvoted: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  commentsUpvoted: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  commentsDownvoted: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

UserSchema.plugin(uniqueValidator);

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", UserSchema);
