const express = require("express");
const subtasksRouter = express.Router();
const subtasksMiddleware = require("../middlewares/checkLogin");
const subtasksControllers = require("../controllers/subtasks");

subtasksRouter.post(
  "/create",
  subtasksMiddleware.checkLogin,
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
  subtasksControllers.editSubtask
);

subtasksRouter.get(
  "/",
  subtasksMiddleware.checkLogin,
  subtasksControllers.getSubtasks
);

module.exports = subtasksRouter;
