const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { logEvents } = require("../middleware/logger");

const dbConfig = asyncHandler(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
    process.exit(1);
  }
});

module.exports = dbConfig;
