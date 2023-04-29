const express = require("express");

const usersControllers = require("../controllers/users");
const usersMiddleware = require("../middlewares/checkLogin");
const {
  singleMemoryUpload,
  errorHandler,
} = require("../middlewares/memoryUpload");
const profileUpload = require("../middlewares/profileUpload");
const validate = require("../middlewares/validate");

const usersRouter = express.Router();

usersRouter.patch(
  "/profile/edit",
  usersMiddleware.checkLogin,
  validate.body("firstname", "lastname", "gender_id"),
  usersControllers.updateProfile
);

usersRouter.patch(
  "/profile/upload",
  usersMiddleware.checkLogin,
  validate.body("image"),
  (req, res, next) =>
    singleMemoryUpload("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  profileUpload,
  usersControllers.uploadImageProfile
);

usersRouter.patch(
  "/notelp/edit",
  validate.body("notelp"),
  usersMiddleware.checkLogin,
  usersControllers.updateNoTelp
);

usersRouter.get(
  "/profile",
  usersMiddleware.checkLogin,
  usersControllers.getProfile
);

module.exports = usersRouter;
