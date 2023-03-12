require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mainRouter = require("./src/routes/main");

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

server.use(mainRouter);

const port = 8000;

server.listen(port, () => {
  console.log(`Server is running successfully, and listening on port ${port}`);
});
