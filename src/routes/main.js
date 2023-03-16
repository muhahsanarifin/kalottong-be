const express = require("express");

const authRouter = require("./auth");
// const usersRouter = require("./users");
const tasksRouter = require("./tasks");
const subtasksRouter = require("./subtasks");

const mainRouter = express.Router();
mainRouter.use("/auth", authRouter);
// mainRouter.use("/users", usersRouter);
mainRouter.use("/tasks", tasksRouter);
mainRouter.use("/subtasks", subtasksRouter);

// mainRouter.get("/", (req, res) => {
//   res.send("Welcome to Kalottong API");
// });

module.exports = mainRouter;
