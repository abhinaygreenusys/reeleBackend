const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const updateLastActiveTime = require("../middleware/updateLastActiveTime");
const {
  createVideo,
  userUploadedVideos,
  publicVideos,
  userPublicVideos,
} = require("../controllers/videoControllers");
const { videoUpload } = require("../middleware/fileUpload");
const router = express.Router();

router
  .post(
    "/upload_video",
    verifyJWT,
    updateLastActiveTime,
    videoUpload.single("video"),
    createVideo
  )
  .get(
    "/user_uploaded_videos",
    verifyJWT,
    updateLastActiveTime,
    userUploadedVideos
  )
  .get("/all_public_videos", verifyJWT, updateLastActiveTime, publicVideos)
  .get(
    "/user_public_videos",
    verifyJWT,
    updateLastActiveTime,
    userPublicVideos
  );

module.exports = router;
