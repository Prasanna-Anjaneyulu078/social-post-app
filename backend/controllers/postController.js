const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const content = req.body.content?.trim() || '';
    if (!content && !req.file) {
      return res.status(400).json({ message: 'Post content or image is required.' });
    }

    const imageUrl = req.file?.path || req.file?.secure_url || req.file?.url || (req.file ? `/uploads/${req.file.filename}` : null);
    const duplicatePost = await Post.findOne({
      user: req.user.id,
      content,
      image: imageUrl,
    });

    if (duplicatePost) {
      return res.status(409).json({ message: 'Duplicate post detected.' });
    }

    const post = await Post.create({
      content,
      image: imageUrl,
      user: req.user.id
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error: Could not save post" });
  }
};

// controllers/postController.js

exports.getPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate("user", "email")
      .populate("likes", "email")
      .populate("comments.user", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post); // Update reflects instantly [cite: 39]
  } catch (err) {
    res.status(500).json({ error: "Like failed" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const text = req.body.text?.trim();
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const duplicateComment = post.comments.some(
      (comment) =>
        comment.user?.toString() === req.user.id &&
        comment.text?.trim()?.toLowerCase() === text.toLowerCase()
    );

    if (duplicateComment) {
      return res.status(409).json({ message: 'Duplicate comment detected.' });
    }

    post.comments.push({ user: req.user.id, text });
    await post.save();
    const updatedPost = await post.populate("comments.user", "email");
    const newComment = updatedPost.comments[updatedPost.comments.length - 1];
    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comment failed" });
  }
};