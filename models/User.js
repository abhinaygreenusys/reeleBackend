const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    trim: true,
  },
  user_pic: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
  },
  password: {
    type: String,
    select: false,
    required: [true, "password is required"],
    trim: true,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", UserSchema);
module.exports = User;
