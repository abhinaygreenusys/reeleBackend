const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Comment = model("Comment", CommentSchema);
module.exports = Comment;
