const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dnuiqwmz4",
  api_key: "155586657113975",
  api_secret: "CZG6dX1jJUj9GGdw3VEvdblBGeI",
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "app",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 512, height: 512, crop: "limit" }],
});

const upload = multer({ storage });

module.exports = upload;
