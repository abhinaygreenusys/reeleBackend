const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const { default: mongoose } = require("mongoose");

const editProfile = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    description,
    user_pic,
    numberFollowers,
    numberFollowing,
    numberLike,
    followers,
    following,
    publicVideos,
    favoriteVideos,
    comments,
    myVideos,
    selectedVideoCategories
  } = req.body;

  try {
    const getUser = await User.findById(req.id);
    if (!getUser) return res.status(404).json({ message: "User not found" });

    const getProfile = await UserProfile.findOne({ user: req.id });

    if (!getProfile)
      return res.status(404).json({ message: "Profile not found" });

    await UserProfile.updateOne(
      { user: req.id },
      {
        $set: {
          description,
          numberFollowers,
          numberFollowing,
          numberLike,
          followers,
          following,
          publicVideos,
          favoriteVideos,
          comments,
          myVideos,
          selectedVideoCategories
        },
      }
    );

    await User.updateOne(
      { _id: req.id },
      {
        name,
        email: email.toLowerCase(),
        user_pic,
      }
    );

    const profile = await UserProfile.findOne({ user: req.id }).populate(
      "user"
    );
    // console.log(profile);
    return res.status(200).json({
      userProfile: profile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    let getProfile;
    if (!userId) {
      getProfile = await UserProfile.findOne({ user: req.id }).populate("user");
    } else {
      getProfile = await UserProfile.findOne({ user: userId }).populate("user");
    }
    if (!getProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const profile = {
      _id: getProfile.user._id,
      name: getProfile.user.name,
      email: getProfile.user.email,
      user_pic: getProfile.user.user_pic,
      description: getProfile.description,
      numberFollowers: getProfile.numberFollowers,
      numberFollowing: getProfile.numberFollowing,
      numberLike: getProfile.numberLike,
      followers: getProfile.followers,
      following: getProfile.following,
      publicVideos: getProfile.publicVideos,
      favouriteVideos: getProfile.favouriteVideos,
      privateVideos: getProfile.privateVideos,
      comments: getProfile.comments,
      selectedVideoCategories:getProfile.selectedVideoCategories
    };
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// const getOtherUsersProfile = asyncHandler(async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const existingProfile = await UserProfile.findOne({
//       user: userId,
//     }).populate("user");
//     if (!existingProfile)
//       return res.status(404).json({ message: "No profile found." });

//     const profile = {
//       _id: existingProfile.user._id,
//       name: existingProfile.user.name,
//       email: existingProfile.user.email,
//       user_pic: existingProfile.user.user_pic,
//       description: existingProfile.description,
//       numberFollowers: existingProfile.numberFollowers,
//       numberFollowing: existingProfile.numberFollowing,
//       numberLike: existingProfile.numberLike,
//       followers: existingProfile.followers,
//       following: existingProfile.following,
//       publicVideos: existingProfile.publicVideos,
//       favouriteVideos: existingProfile.favouriteVideos,
//       privateVideos: existingProfile.privateVideos,
//       comments: existingProfile.comments,
//     };
//     res.status(200).json(profile);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// });

module.exports = { getUserProfile, editProfile };
