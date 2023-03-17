const express = require("express");
const tasksRouter = express.Router();
const tasksMiddleware = require("../middlewares/checkLogin");
const tasksControllers = require("../controllers/tasks");

// const checkRolesMiddleware = require("../middlewares/checkRoles");

tasksRouter.post(
  "/create",
  tasksMiddleware.checkLogin,
  tasksControllers.createTasks
);
tasksRouter.patch(
  "/edit/:id",
  tasksMiddleware.checkLogin,
  tasksControllers.editTask
);

tasksRouter.delete(
  "/delete/:id",
  tasksMiddleware.checkLogin,
  tasksControllers.deleteTask
);

tasksRouter.get("/", tasksMiddleware.checkLogin, tasksControllers.getTasks);

module.exports = tasksRouter;
