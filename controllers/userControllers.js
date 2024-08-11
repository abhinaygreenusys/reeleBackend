const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserProfile = require("../models/UserProfile");
const { s3Images } = require("../utils/s3");
const fs = require("fs");
const path = require("path");

const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log({ name, email, password });
  // console.log(req.file.path);
  let user_pic;
  try {
    const duplicateUser = await User.findOne({ email });
    if (duplicateUser) {
      return res.status(400).json({ message: "email exists already." });
    }
    if (req?.file?.path) {
      // console.log(req.file);;
      const file = req.file;
      // const filePath = path.join(__dirname, "uploads", file.filename);
      const filePath = `uploads/images/${file.filename}`;
      const fileBuffer = fs.readFileSync(filePath);
      const awsResponse = await s3Images(file.filename, fileBuffer);
      user_pic = awsResponse.Location;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      user_pic,
    });

    const token = await jwt.sign(
      {
        UserInfo: {
          userId: createUser.id,
          userEmail: createUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await createUser.save();

    const newUserProfile = new UserProfile({
      description: null,
      followers: [],
      following: [],
      publicVideos: [],
      privateVideos: [],
      favoriteVideos: [],
      comments: [],
      selectedVideoCategories:[],
      user: createUser.id,
    });

    await newUserProfile.save();
    // console.log(newUserProfile);
    // const response = await UserProfile.findById(newUserProfile.id).populate(
    //   "user"
    // );
    res.cookie("jwt", token, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    res.status(201).json({
      User: createUser,
      token: token,
      message: "User created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error._message);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // console.log({ email, password });
    const getUser = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    // console.log(getUser.id);
    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(password);
    // console.log(getUser.password);
    const checkPassword = await bcrypt.compare(password, getUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = await jwt.sign(
      {
        UserInfo: {
          userId: getUser.id,
          userEmail: getUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    res.status(200).json({
      User: getUser,
      token: token,
      message: "User logged in successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const checkUserLastActive = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.id);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

module.exports = { signUp, login, checkUserLastActive };
