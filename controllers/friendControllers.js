const asyncHandler = require("express-async-handler");
const Friend = require("../models/Friend");
const User = require("../models/User");

const sendRequest = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;

  try {
    const findExistingRequest = await Friend.findOne({
      requester: req.id,
      recipient: recipientId,
      status: "pending",
    });

    if (findExistingRequest)
      return res.status(400).json({ message: "Requst already exists." });

    const friendRequest = new Friend({
      requester: req.id,
      recipient: recipientId,
    });
    await friendRequest.save();

    const findRequest = await Friend.findById(friendRequest.id).populate(
      "recipient"
    );

    res.status(200).json(findRequest);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const acceptRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body;
  try {
    const checkRequestId = await Friend.findById(requestId);
    if (!checkRequestId)
      return res.status(404).json({ message: "Request id not found" });
    const updatedRequest = await Friend.findOneAndUpdate(
      {
        _id: requestId,
        recipient: req.id,
      },
      { status: "accepted" }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        message: "No matching friend request found for the recipient",
      });
    }

    res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
    console.log(error);
    res.status.json(error.message);
  }
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body;

  try {
    const checkRequestId = await Friend.findById(requestId);

    if (!checkRequestId)
      return res.status(404).json({ message: "Request id not found" });
    const updatedRequest = await Friend.findOneAndUpdate(
      {
        _id: requestId,
        recipient: req.id,
      },
      { status: "rejected" }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        message: "No matching friend request found for the recipient",
      });
    }
    res.status(200).json({ message: "Friend request rejected!" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }

  // await Friend.findByIdAndUpdate(requestId, { status: "rejected" });
  // res.status(200).json({ message: "Friend request rejected!" });
});

const getAllPendingRequests = asyncHandler(async (req, res) => {
  console.log(req.id);
  try {
    const requests = await Friend.find({
      recipient: req.id,
      status: "pending",
    }).populate("requester");
    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const getAllSentRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await Friend.find({
      requester: req.id,
      status: "pending",
    }).populate("recipient");
    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const getRecommendationsWithSentRequests = asyncHandler(async (req, res) => {
  const userId = req.id;
  try {
    // Find friends of the user
    const friends = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    //sent and recieved requests code
    const sentRequests = await Friend.find({
      requester: req.id,
      status: "pending",
    }).populate("recipient");

    const recievedRequests = await Friend.find({
      recipient: req.id,
      status: "pending",
    }).populate("requester");
    //

    const friendIds = friends.map((friend) =>
      friend.requester.toString() === userId
        ? friend.recipient
        : friend.requester
    );
    // Find friends of friends
    const friendOfFriends = await Friend.find({
      $or: [
        { requester: { $in: friendIds } },
        { recipient: { $in: friendIds } },
      ],
      status: "accepted",
    });

    const recommendationIds = friendOfFriends
      .map((friend) =>
        friend.requester.toString() === userId
          ? friend.recipient
          : friend.requester
      )
      .filter(
        (id) => !friendIds.includes(id.toString()) && id.toString() !== userId
      );

    const recommendations = await User.find({
      _id: { $in: recommendationIds },
    });

    let users = [];
    let userObj;

    // console.log(requests);

    //sent requests code
    sentRequests.map((user) => {
      userObj = {
        _id: user.recipient._id,
        name: user.recipient.name,
        email: user.recipient.email,
        user_pic: user.recipient.user_pic,
        status: "pending",
      };
      users.push(userObj);
    });

    //

    if (recommendations.length === 0) {
      const requesterIds = sentRequests.map((i) => i.recipient._id);
      const reciepientIds = recievedRequests.map((i) => i.requester._id);
      const mergedArray = [...requesterIds, ...reciepientIds];
      console.log(mergedArray);
      const selectedRandomUsers = await User.find({
        _id: { $ne: req.id, $nin: mergedArray },
      });
      // console.log(selectedRandomUsers);
      selectedRandomUsers.map((user) => {
        userObj = {
          _id: user._id,
          name: user.name,
          email: user.email,
          user_pic: user.user_pic,
          status: null,
        };
        users.push(userObj);
      });
    }

    recommendations.map((user) => {
      userObj = {
        _id: user._id,
        name: user.name,
        email: user.email,
        user_pic: user.user_pic,
        status: null,
      };

      users.push(userObj);
    });
    // console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const getFriendsList = asyncHandler(async (req, res) => {
  const userId = req.id;
  try {
    const friends = await Friend.find({
      $and: [
        {
          $or: [{ requester: userId }, { recipient: userId }],
        },
        { status: "accepted" },
      ],
    }).populate("requester recipient"); // Adjust the fields to populate as per your User model

    if (!friends || friends.length === 0)
      return res.status(404).json({ message: "no friends found" });
    // Extract friend user details
    console.log(friends[0].requester.id);
    const friendList = friends.map((friend) => {
      if (friend.requester.id.toString() === userId.toString()) {
        return friend.recipient;
      } else {
        return friend.requester;
      }
    });
    res.status(200).json(friendList);
  } catch (error) {
    console.log(error);
    res.status(400).json(error._message);
  }
});

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getAllPendingRequests,
  getAllSentRequests,
  getRecommendationsWithSentRequests,
  getFriendsList,
};
