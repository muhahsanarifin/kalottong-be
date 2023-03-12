const express = require("express");

const authControllers = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/register", authControllers.register);

module.exports = authRouter
