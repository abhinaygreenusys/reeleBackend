const asyncHandler = require("express-async-handler");
const LikeDislike = require("../models/LikeDislike");
const Video = require("../models/Video");

const likeDislikeVideo = asyncHandler(async (req, res) => {
  const { isLiked, videoId } = req.body;
  try {
    const existingLike = await LikeDislike.findOne({
      user: req.id,
      video: videoId,
    });

    if (existingLike) {
      console.log(existingLike);
      if (isLiked === false) {
        await LikeDislike.findByIdAndDelete(existingLike.id);
        let existingVideo = await Video.findById(videoId);
        existingVideo.number_like -= 1;
        await existingVideo.save();
        res.status(201).json({ message: "Disliked successfully" });
      } else {
        res.status(400).json({ message: "not allowed" });
      }
    }

    if (isLiked === false)
      return res.status(400).json({ message: "Action not allowed" });

    const newLike = await LikeDislike({
      isLiked,
      user: req.id,
      video: videoId,
    });

    await newLike.save();
    // console.log(videoId);
    let existingVideo = await Video.findById(videoId);
    existingVideo.number_like += 1;
    await existingVideo.save();

    // const like = await LikeDislike.findById(newLike._id).populate("user video");
    res.status(201).json({ message: "Liked successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = { likeDislikeVideo };
