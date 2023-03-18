const express = require("express");

const usersControllers = require("../controllers/users");
const usersMiddleware = require("../middlewares/checkLogin");
const {
  singleMemoryUpload,
  errorHandler,
} = require("../middlewares/memoryUpload");
const profileUpload = require("../middlewares/profileUpload");

const usersRouter = express.Router();

usersRouter.patch(
  "/profile/edit",
  usersMiddleware.checkLogin,
  usersControllers.updateProfile
);

usersRouter.patch(
  "/profile/upload",
  usersMiddleware.checkLogin,
  (req, res, next) =>
    singleMemoryUpload("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  profileUpload,
  usersControllers.uploadImageProfile
);

usersRouter.get("/profile", usersMiddleware.checkLogin, usersControllers.getProfile);

module.exports = usersRouter;
