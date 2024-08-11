const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const MIME_TYPE_MAP_IMAGE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const MIME_TYPE_MAP_VIDEO = {
  "video/mp4": "mp4",
  "video/mkv": "mkv",
  "video/wmv": "wmv",
  "video/mov": "mov",
  "video/avi": "avi",
};
const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images/");
    },
    filename: (req, file, cb) => {
      cb(null, uuid() + path.extname(file.originalname));
    },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP_IMAGE[file.mimetype];
      let error = isValid ? null : new Error("Invalid mime type!");
      cb(error, isValid);
    },
  }),
});

const videoUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/videos/");
    },
    filename: (req, file, cb) => {
      cb(null, uuid() + path.extname(file.originalname));
    },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP_VIDEO[file.mimetype];
      let error = isValid ? null : new Error("Invalid mime type!");
      cb(error, isValid);
    },
    limits: {
      fileSize: 100 * 1024 * 1024, // 100 MB limit for videos (in bytes)
    },
  }),
});

module.exports = { imageUpload, videoUpload };
