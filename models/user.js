const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String, 
    required: true,
    minlength: 3,
    unique: true,
    uniqueCaseInsensitive: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date, 
    default: new Date()
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  postsUpvoted: [
    {
      type: String, 
      ref: 'Post'
    }
  ],
  postsDownvoted: [
    {
      type: String, 
      ref: 'Post'
    }
  ]
});

UserSchema.plugin(uniqueValidator);

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

module.exports = mongoose.model('User', UserSchema);