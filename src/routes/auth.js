const express = require("express");

const authControllers = require("../controllers/auth");
const authMiddleware = require("../middlewares/checkLogin");

const authRouter = express.Router();

authRouter.post("/register", authControllers.register);
authRouter.post("/login", authControllers.login);
authRouter.delete("/logout", authMiddleware.checkLogin, authControllers.logout);
authRouter.get("/roles", authMiddleware.checkLogin, authControllers.getRoles);

module.exports = authRouter;
