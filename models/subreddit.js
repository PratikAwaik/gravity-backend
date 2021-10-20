const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const SubredditSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  description: {
    type: String,
    required: true,
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
  moderators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: {
    type: Date,
  },
});

SubredditSchema.plugin(uniqueValidator);

SubredditSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

SubredditSchema.post("save", async function (doc) {
  const User = this.model("User");
  const user = await User.findById(doc.members[0]);
  await User.findByIdAndUpdate(user.id, {
    subscriptions: user.subscriptions.concat(doc._id),
  });
});

module.exports = mongoose.model("Subreddit", SubredditSchema);
