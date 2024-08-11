require("dotenv").config();
const express = require("express");
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");
const { logger, logEvents } = require("./middleware/logger");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const app = express();
const port = process.env.PORT || 4001;
const path = require("path");
const fs = require("fs");
dbConfig();
const fileUploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(fileUploadDirectory))
  fs.mkdirSync(fileUploadDirectory, { recursive: true });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);
app.use(cookieParser());

// app.use("/admin", require("./routes/adminRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/friend", require("./routes/friendRoutes"));
app.use("/video", require("./routes/videoRoutes"));
app.use("/comment", require("./routes/commentRoutes"));
app.use("/likeDislike", require("./routes/likeDislikeRoutes"));
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`server running on ${port}`);
  });
});


mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});


app.get("/",(req,res)=>{
     res.send("<h1>Running👍</h1>");
})
