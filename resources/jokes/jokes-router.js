const router = require("express").Router();
const {
  findJokes,
  findUserJokes,
  findJokeById,
  addJoke,
  updateJoke,
  deleteJoke
} = require("./jokes-model");

router.get("/", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const jokes = await findJokes(userId);
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/me", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const jokes = await findUserJokes(userId);
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const joke = await findJokeById(userId, id);
    if (!joke) {
      return res.status(400).json({
        error: "No joke found with the given id"
      });
    }
    res.status(200).json(joke);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  const { setup, punchline } = req.body;
  const joke = req.body;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    if (!setup || !punchline) {
      res.status(400).json({ error: "Setup and punchline are required!" });
    } else {
      const newJoke = await addJoke(userId, joke);
      res.status(201).json(newJoke);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  const updates = req.body;
  if (Object.entries(updates).length === 0 && updates.constructor === Object) {
    return res
      .status(400)
      .json({ error: "Invalid request, req body cannot be empty" });
  }
  try {
    const updated = await updateJoke(userId, id, updates);

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    await deleteJoke(userId, id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
