const express = require("express");

const usersControllers = require("../controllers/users");
const usersMiddleware = require("../middlewares/checkLogin");

const usersRouter = express.Router();

usersRouter.patch(
  "/profile/edit",
  usersMiddleware.checkLogin,
  usersControllers.updateProfile
);

module.exports = usersRouter
