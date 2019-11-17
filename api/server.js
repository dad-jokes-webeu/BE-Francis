const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { restricted } = require("../auth/auth-middleware");
const authRouter = require("../auth/auth-router");
const userRouter = require("../resources/user/user-router");
const jokesRouter = require("../resources/jokes/jokes-router");
const publicJokesRouter = require("../resources/jokes/public-jokes-router");

const secrets = require("../config/secrets");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const server = express();

const sessionOptions = {
  name: "sprintCookie",
  secret: secrets.jwtSecret,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("../database/dbConfig"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.use("/api/auth", authRouter);
server.use("/api/me", userRouter);
server.use("/api/jokes", restricted, jokesRouter);
server.use("/api/public", publicJokesRouter);

module.exports = server;
