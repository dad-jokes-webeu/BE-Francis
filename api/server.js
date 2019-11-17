const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const authRouter = require("../routers/auth-router");
const userRouter = require("../routers/user-router");
const jokesRouter = require("../routers/jokes-router");
const publicJokesRouter = require("../routers/public-jokes-router");

const secrets = require("../config/secrets");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const { restricted } = require("../middleware/auth-middleware");

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

const { version, description } = require("../package.json");

const swaggerDefinition = {
  info: {
    title: "Dad Jokes API - Lambda Build Week",
    version,
    description
  },
  host:
    process.env.NODE_ENV === "production"
      ? "dadjokes-api.herokuapp.com"
      : `localhost:${process.env.PORT}`,
  basePath: "/api/"
};

console.log(process.env.NODE_ENV)

const docOptions = {
  swaggerDefinition,
  apis: ["./docs/*.js", "./routers/*.js"]
};

const swaggerSpec = swaggerJSDoc(docOptions);

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.use("/api/auth", authRouter);
server.use("/api/me", restricted, userRouter);
server.use("/api/jokes", restricted, jokesRouter);
server.use("/api/public", publicJokesRouter);

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = server;
