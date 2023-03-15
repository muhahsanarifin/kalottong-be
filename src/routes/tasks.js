const express = require("express");
const tasksRouter = express.Router();
const authMiddleware = require("../middlewares/checkLogin");
const tasksControllers = require("../controllers/tasks");

// const checkRolesMiddleware = require("../middlewares/checkRoles");

tasksRouter.post(
  "/create",
  authMiddleware.checkLogin,
  tasksControllers.createTasks
);
tasksRouter.patch(
  "/edit/:id",
  authMiddleware.checkLogin,
  tasksControllers.editTask
);

tasksRouter.delete(
  "/delete/:id",
  authMiddleware.checkLogin,
  tasksControllers.deleteTask
);

tasksRouter.get("/", authMiddleware.checkLogin, tasksControllers.getTasks);

module.exports = tasksRouter;
