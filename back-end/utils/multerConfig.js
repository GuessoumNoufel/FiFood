const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const AppError = require("./appError");
const { Readable } = require("stream");

const multerFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 2 },
});

function hasValidSignature(file) {
  const data = file.buffer;
  if (file.mimetype === "image/jpeg") {
    return (
      data.length >= 3 &&
      data[0] === 0xff &&
      data[1] === 0xd8 &&
      data[2] === 0xff
    );
  }
  if (file.mimetype === "image/png") {
    return (
      data.length >= 8 &&
      data.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
    );
  }
  if (file.mimetype === "image/webp") {
    return (
      data.length >= 12 &&
      data.toString("ascii", 0, 4) === "RIFF" &&
      data.toString("ascii", 8, 12) === "WEBP"
    );
  }
  return false;
}

function uploadToCloudinary(file) {
  if (!hasValidSignature(file)) {
    throw new AppError(
      "The uploaded file is not a valid JPEG, PNG or WebP image",
      400,
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "recipe-app",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url)
          return reject(new Error("Image upload did not return a secure URL"));
        file.path = result.secure_url;
        file.filename = result.public_id;
        resolve();
      },
    );
    Readable.from([file.buffer]).pipe(stream);
  });
}

function uploadFilesToCloudinary(req, res, next) {
  const files = req.file ? [req.file] : Object.values(req.files ?? {}).flat();
  Promise.resolve()
    .then(() => Promise.all(files.map(uploadToCloudinary)))
    .then(() => next(), next);
}

exports.uploadRecipeImage = [upload.single("image"), uploadFilesToCloudinary];

exports.uploadUserImages = [
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadFilesToCloudinary,
];
