const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");
const fs = require("fs");
const path = require("path");
const { s3Videos } = require("../utils/s3");
const checkVideoType = require("../utils/checkVideoType");

const createVideo = asyncHandler(async (req, res) => {
  const {
    status,
    description,
    videoType,
    hashtags_video,
    sound_id,
    sound_title,
    video_category
  } = req.body;
  let videoLink;

  try {
    if (!checkVideoType(videoType))
      return res.status(400).json({ message: "Video Type not allowed" });
    if (req?.file.path) {
      const file = req.file;
      const filePath = `uploads/videos/${file.filename}`;
      const fileBuffer = fs.readFileSync(filePath);
      const awsResponse = await s3Videos(file.filename, fileBuffer);
      videoLink = awsResponse.Location;
    }
    const newVideo = new Video({
      status,
      description,
      videoLink,
      videoType,
      hashtags_video,
      sound_id,
      sound_title,
      video_category,
      uploader: req.id,
    });

    await newVideo.save();
    const video = await Video.findById(newVideo.id).populate("uploader");
    res.status(201).json({ video, message: "Video uploaded successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const publicVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find({
      videoType: "public",
      _id: { $ne: req.id },
    });
    if (!videos) return res.status(404).json({ message: "No videos found." });
    res.status(200).json(videos);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const userPublicVideos = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const videos = await Video.find({
      videoType: "public",
      _id: userId,
    });
    if (!videos) return res.status(404).json({ message: "No videos found." });
    res.status(200).json(videos);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const userUploadedVideos = asyncHandler(async (req, res) => {
  try {
    const publicVideos = await Video.find({
      uploader: req.id,
      videoType: "public",
    });
    const privateVideos = await Video.find({
      uploader: req.id,
      videoType: "private",
    });
    const favouriteVideos = await Video.find({
      uploader: req.id,
      videoType: "favourite",
    });
    let videos = {
      publicVideos,
      privateVideos,
      favouriteVideos,
    };
    // if (!videos) return res.status(404).json({ message: "No videos found." });
    res.status(200).json(videos);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = {
  createVideo,
  publicVideos,
  userPublicVideos,
  userUploadedVideos,
};
