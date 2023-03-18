const multer = require("multer");
const path = require("path");

let limits = {
  fileSize: 204800,
};

const fileFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  const allowedExt = /jpeg|jpg|png|webp/;
  if (!allowedExt.test(extName)) {
    return cb({
      msg: "Only use allowed extension (JPEG, JPG, PNG WEBP",
    });
  }
  cb(null, true);
};

const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits,
});

const errorHandler = (err, res, next) => {
  // console.log("Error: ", err);
  // if (err instanceof multer.MulterError) {
  //   return res.status(500).json({
  //     msg: "Upload error",
  //   });
  // }
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        data: null,
        msg: "File size it too large. Allowed file size less than equel to 2mb",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        data: null,
        msg: "Too many files",
      });
    }
    if(err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        data: null,
        msg: "Unexpected field",
      });
    }
  }
  next();
};

module.exports = {
  singleMemoryUpload: (fieldName) => memoryUpload.single(fieldName),
  errorHandler,
};
