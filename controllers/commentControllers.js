const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Video = require("../models/Video");

const postComment = asyncHandler(async (req, res) => {
  const { comment, videoId } = req.body;
  try {
    if (!videoId || !comment)
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });

    const newComment = await Comment({
      comment,
      user: req.id,
      video: videoId,
    });

    await newComment.save();
    await Video.findByIdAndUpdate(videoId, {
      $inc: { number_comments: 1 },
    });
    // const commentResponse = await Comment.findById(newComment.id).populate(
    //   "user video"
    // );

    const commentResponse = await Comment.find({ video: videoId }).populate(
      "user video"
    );

    res.status(201).json(commentResponse);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const getVideoCommentsList = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    if (!videoId)
      return res.status(400).json({ message: "Please provide videoId." });
    const comments = await Comment.find({ video: videoId }).populate(
      "user video"
    );
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = { postComment, getVideoCommentsList };
