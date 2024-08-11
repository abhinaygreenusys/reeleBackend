const { Schema, model } = require("mongoose");

const UserProfileSchema = new Schema({
  description: {
    type: String,
    maxlength: 300,
    trim: true,
  },
  numberFollowers: {
    type: Number,
    default: 0,
  },
  numberFollowing: {
    type: Number,
    default: 0,
  },
  numberLike: {
    type: Number,
    default: 0,
  },
  followers: {
    type: [String],
  },
  following: {
    type: [String],
  },
  publicVideos: {
    type: [String],
  },
  privateVideos: {
    type: [String],
  },
  favouriteVideos: {
    type: [String],
  },
  comments: {
    type: [String],
  },
  selectedVideoCategories: {
    type: [String],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
});

const UserProfile = model("Userprofile", UserProfileSchema);
module.exports = UserProfile;
