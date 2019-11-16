const router = require("express").Router();
const db = require("../../database/dbConfig");

router.get("/", async (res, req) => {
  console.log(req);
  const publicJokes = await db("jokes").where({ public: 1 });
  res.status(200).json(publicJokes);
});
