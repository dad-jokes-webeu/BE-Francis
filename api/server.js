const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { restricted } = require("../auth/auth-middleware");
const authRouter = require("../auth/auth-router");
const userRouter = require("../resources/user/user-router");
const jokesRouter = require("../resources/jokes/jokes-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/me", userRouter);
server.use("/api/me/jokes", restricted, jokesRouter);

module.exports = server;
