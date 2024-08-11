const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const updateLastActiveTime = asyncHandler(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.id, {
      lastActive: new Date(),
    });

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json(error._message);
  }
});

module.exports = updateLastActiveTime;
