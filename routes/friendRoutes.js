const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getAllPendingRequests,
  getAllSentRequests,
  getRecommendationsWithSentRequests,
  getFriendsList,
} = require("../controllers/friendControllers");
const updateLastActiveTime = require("../middleware/updateLastActiveTime");
const verifyJWT = require("../middleware/verifyJWT");
const express = require("express");
const router = express.Router();

router
  .post("/send-request", verifyJWT, updateLastActiveTime, sendRequest)
  .put("/accept-request", verifyJWT, updateLastActiveTime, acceptRequest)
  .put("/reject-request", verifyJWT, updateLastActiveTime, rejectRequest)
  .get(
    "/recieved-reqests",
    verifyJWT,
    updateLastActiveTime,
    getAllPendingRequests
  )
  .get("/sent-requests", verifyJWT, updateLastActiveTime, getAllSentRequests)
  .get("/recommendations", verifyJWT, updateLastActiveTime, getRecommendationsWithSentRequests)
  .get("/list", verifyJWT, updateLastActiveTime, getFriendsList);

module.exports = router;
