const { likeDislikeVideo } = require("../controllers/LikeDislikeControllers");
const updateLastActiveTime = require("../middleware/updateLastActiveTime");
const verifyJWT = require("../middleware/verifyJWT");
const express = require("express");
const router = express.Router();

router.post("/", verifyJWT, updateLastActiveTime, likeDislikeVideo);

module.exports = router;
