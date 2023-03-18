const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../configs/cloudinary");

const profileUpload = async (req, res, next) => {
  const { file, userPayload } = req;
  if (!file) return next();

  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  const fileName = `kalottong_user_${userPayload.user_id}`;
  const cloudinaryOpt = {
    public_id: fileName,
    folder: "kalottong",
  };
  try {
    const result = await cloudinary.uploader.upload(
      datauri.content,
      cloudinaryOpt
    );
    req.file = result;
    next();
  } catch (error) {
    res.status(error).json({
      msg: "Internet server error",
    });
  }
};

module.exports = profileUpload;
