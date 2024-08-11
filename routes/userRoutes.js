const express = require("express");
const {
  login,
  signUp,
  checkUserLastActive,
} = require("../controllers/userControllers");
const verifyJWT = require("../middleware/verifyJWT");
const {
  getUserProfile,
  editProfile,
  getOtherUsersProfile,
} = require("../controllers/userProfileControllers");
const updateLastActiveTime = require("../middleware/updateLastActiveTime");
const { imageUpload } = require("../middleware/fileUpload");

const router = express.Router();

router
  .post("/sign-up", imageUpload.single("user_pic"), signUp)
  .post("/login", updateLastActiveTime, login)
  .post("/profile/edit", verifyJWT, updateLastActiveTime, editProfile)
  .get("/profile", verifyJWT, updateLastActiveTime, getUserProfile)
  .get(
    "/last-active-time",
    verifyJWT,
    updateLastActiveTime,
    checkUserLastActive
  )
  // .get(
  //   "/others_profile",
  //   verifyJWT,
  //   updateLastActiveTime,
  //   getOtherUsersProfile
  // );
module.exports = router;
