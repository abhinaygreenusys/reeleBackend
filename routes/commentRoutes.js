const {
  postComment,
  getVideoCommentsList,
} = require("../controllers/commentControllers");
const updateLastActiveTime = require("../middleware/updateLastActiveTime");
const verifyJWT = require("../middleware/verifyJWT");
const express = require("express");
const router = express.Router();

router
  .post("/post_comment", verifyJWT, updateLastActiveTime, postComment)
  .get("/video_comments", verifyJWT, updateLastActiveTime, getVideoCommentsList);

module.exports = router;
