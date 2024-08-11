const { Schema, model } = require("mongoose");

const VideoSchema = new Schema({
  status: {
    type: String,
  },
  description: {
    type: String,
  },
  videoLink: {
    type: String,
  },

  videoType: {
    type: String,
    enum: ["public", "private", "favourite"],
    default: "public",
  },
  hashtags_video: {
    type: String,
  },
  sound_id: {
    type: String,
  },
  sound_title: {
    type: String,
  },
  sound_thumbnail: {
    type: String,
  },
  video_thumbnail: {
    type: String,
  },
  video_category: {
    type: String,
  },
  number_like: {
    type: Number,
    default: 0,
  },
  number_comments: {
    type: Number,
    default: 0,
  },
  number_share: {
    type: Number,
    default: 0,
  },
  uploader: { type: Schema.Types.ObjectId, ref: "User" },
});

const Video = new model("Video", VideoSchema);
module.exports = Video;
