const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    text: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Check if model exists before compiling to avoid OverwriteModelError
module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);