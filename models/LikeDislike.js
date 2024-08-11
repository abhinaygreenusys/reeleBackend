const { Schema, model } = require("mongoose");

const LikeDislikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  isLiked: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const LikeDislike = model("LikeDislike", LikeDislikeSchema);
module.exports = LikeDislike;
