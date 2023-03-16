const express = require("express");
const subtasksRouter = express.Router();
const authMiddleware = require("../middlewares/checkLogin");
const subtasksControllers = require("../controllers/subtasks");

subtasksRouter.post(
  "/create",
  authMiddleware.checkLogin,
  subtasksControllers.createSubtask
);

subtasksRouter.delete(
  "/delete/:id",
  authMiddleware.checkLogin,
  subtasksControllers.deleteSubtask
);

subtasksRouter.patch(
  "/edit/:id",
  authMiddleware.checkLogin,
  subtasksControllers.editSubtask
);

subtasksRouter.get(
  "/",
  authMiddleware.checkLogin,
  subtasksControllers.getSubtasks
);

module.exports = subtasksRouter;
