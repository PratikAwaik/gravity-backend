const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { transformModel } = require("../utils/helpers");
const Schema = mongoose.Schema;

const SubredditSchema = new Schema({
  name: {
    type: String,
    required: [true, "You can't create a nameless community :/"],
    unique: true,
    uniqueCaseInsensitive: true,
  },
  prefixedName: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Write something about your community, will you?"],
  },
  communityIcon: {
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  membersCount: {
    type: Number,
    default: 1,
  },
  moderator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coverColor: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: {
    type: Date,
  },
});

SubredditSchema.plugin(uniqueValidator, {
  message:
    "Be a little creative. Provide a different {PATH} as this one is already taken.",
});

SubredditSchema.set("toJSON", {
  transform: (document, returnedObject) =>
    transformModel(document, returnedObject),
});

SubredditSchema.post("save", async function (doc) {
  const User = this.model("User");
  const user = await User.findById(doc.members[0]);
  await User.findByIdAndUpdate(user.id, {
    moderating: user.moderating.concat(doc._id),
    subscriptions: user.subscriptions.concat(doc._id),
  });
});

module.exports = mongoose.model("Subreddit", SubredditSchema);
