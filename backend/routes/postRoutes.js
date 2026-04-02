const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createPost, getPosts, toggleLike, addComment } = require("../controllers/postController");

router.get("/", getPosts); // Public feed [cite: 18]
router.post("/", auth, upload.single("image"), createPost); // Auth creation 
router.put("/:id/like", auth, toggleLike); // Engagement [cite: 21]
router.post("/:id/comment", auth, addComment);

module.exports = router;