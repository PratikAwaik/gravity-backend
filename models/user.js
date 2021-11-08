const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [
      true,
      "It's difficult to a identify person without their name. Please provide it.",
    ],
    minlength: [3, "Your username must have atleast 3 characters"],
    unique: true,
    uniqueCaseInsensitive: true,
  },
  prefixedName: {
    type: String,
  },
  email: {
    type: String,
    required: [
      true,
      "Please provide your email. Don't worry, I won't steal anything like Facebook",
    ],
    unique: true,
    uniqueCaseInsensitive: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
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
  moderating: [
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

UserSchema.plugin(uniqueValidator, {
  message:
    "Be a little creative. Provide a different {PATH} as this one is already taken.",
});

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", UserSchema);
