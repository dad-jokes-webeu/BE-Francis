const router = require("express").Router();
const db = require("../database/dbConfig");
const multer = require("multer");
const { updateAvatar, findAvatarById } = require("../models/avatars-model");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "demo",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

router.get("/", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const [avatar] = await db("avatars").where({ user_id: userId });
    res.status(200).json(avatar);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/", parser.single("image"), async (req, res) => {
  const url = req.file.url;
  const { decodedJwt } = req;
  const user_id = decodedJwt.subject;
  try {
    const [url_id] = await db("avatars").insert({ url, user_id });
    const stored_url = findAvatarById(url_id);
    return res.status(201).json(stored_url);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.put("/:id", parser.single("image"), async (req, res) => {
  const url = req.file.url;
  const { id } = req.params;
  if (!url) res.status(400).json({ message: `invalid request` });
  try {
    const avatar = await updateAvatar(id, url);
    res.status(200).json(avatar);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
