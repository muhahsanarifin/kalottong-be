const express = require("express");
const tasksRouter = express.Router();
const tasksMiddleware = require("../middlewares/checkLogin");
const tasksControllers = require("../controllers/tasks");
const validate = require("../middlewares/validate");

// const checkRolesMiddleware = require("../middlewares/checkRoles");

tasksRouter.post(
  "/create",
  tasksMiddleware.checkLogin,
  validate.body("title", "description", "date_and_time"),
  tasksControllers.createTasks
);
tasksRouter.patch(
  "/edit/:id",
  tasksMiddleware.checkLogin,
  validate.body("title", "description", "status_id", "date_and_time"),
  tasksControllers.editTask
);

tasksRouter.delete(
  "/delete/:id",
  tasksMiddleware.checkLogin,
  tasksControllers.deleteTask
);

tasksRouter.get("/", tasksMiddleware.checkLogin, tasksControllers.getTasks);

module.exports = tasksRouter;
