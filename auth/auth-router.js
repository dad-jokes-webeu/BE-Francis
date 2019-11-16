const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const { generateToken, restricted } = require("./auth-middleware");
const add = require("./auth-model");

router.post("/register", async (req, res) => {
  let { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      error: "`email`, `name` and `password` are required!"
    });
  }
  try {
    const hash = bcrypt.hashSync(password, 10);
    const [id] = await add("users").insert({
      email,
      name,
      password: hash
    });
    const [user] = await db("users").where({ id });
    const token = generateToken(user);
    return res.status(201).json({ user: user, token });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "`email` and `password` are required!"
    });
  }

  try {
    const [user] = await db("users").where({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      await db("users")
        .where({ email })
        .update({ jwt: token });
      return res.status(200).json({ message: `Welcome ${user.email}`, token });
    } else {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/logout", restricted, async (req, res, next) => {
  // Access to this route handler is granted if a token is supplied via the
  // `Authorization` header as enforced by the `restricted` middleware.
  // Thus, we can ensure there is a `userId` from the decodedJwt.
  const userId = req.decodedJwt.subject;
  try {
    // Invalidate the current jwt associated with this user
    await db("users")
      .where({ id: userId })
      .update({ jwt: null });
    // Next, handle deleting sessions for this user
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          return next(error);
        } else {
          return res.redirect("/");
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
