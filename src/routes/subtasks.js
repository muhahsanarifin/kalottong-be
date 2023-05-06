const express = require("express");
const subtasksRouter = express.Router();
const subtasksMiddleware = require("../middlewares/checkLogin");
const subtasksControllers = require("../controllers/subtasks");
const validate = require("../middlewares/validate");

subtasksRouter.post(
  "/create",
  subtasksMiddleware.checkLogin,
  validate.body("tasks_id", "status_id", "title"),
  subtasksControllers.createSubtask
);

subtasksRouter.delete(
  "/delete/:id",
  subtasksMiddleware.checkLogin,
  subtasksControllers.deleteSubtask
);

subtasksRouter.patch(
  "/edit/:id",
  subtasksMiddleware.checkLogin,
  validate.body("title", "status_id"),
  subtasksControllers.editSubtask
);

subtasksRouter.get(
  "/",
  subtasksMiddleware.checkLogin,
  subtasksControllers.getSubtasks
);

module.exports = subtasksRouter;
