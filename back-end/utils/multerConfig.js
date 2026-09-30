const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");
const AppError = require("./AppError");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipe-app", // all uploads land in this folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadRecipeImage = upload.single("image");

exports.uploadUserImages = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
