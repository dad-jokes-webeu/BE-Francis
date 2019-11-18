const router = require("express").Router();
const db = require("../database/dbConfig");

router.get("/", async (req, res) => {
  try {
    const jokes = await db("jokes").where({ private: 0 });
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
