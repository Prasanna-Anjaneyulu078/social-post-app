import React, { useState, useMemo } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Heart, MessageCircle, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { postsAPI } from '../../services/api';
import './index.css';

export default function PostCard({ post, currentUserEmail }) {
  const currentUserId = Cookies.get('userId');
  const normalizeLikes = (likes) =>
    Array.isArray(likes)
      ? likes
          .map((like) => {
            if (!like) return null;
            if (typeof like === 'string') return like;
            if (typeof like === 'object') return like._id?.toString() || like.id?.toString();
            return null;
          })
          .filter(Boolean)
      : [];

  const postLikeIds = useMemo(() => normalizeLikes(post.likes), [post.likes]);
  const [likes, setLikes] = useState(postLikeIds.length);
  const [isLiked, setIsLiked] = useState(
    currentUserId ? postLikeIds.includes(currentUserId) : false
  );
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentError, setCommentError] = useState('');

  const postId = post._id || post.id;
  const username = post.user?.email === currentUserEmail
    ? 'You'
    : post.user?.email || post.username || 'Anonymous';
  const avatarLetter = (username.charAt(0) || 'A').toUpperCase();

  const handleLike = async () => {
    try {
      // Optimistic Update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikes(newLikedState ? likes + 1 : likes - 1);
      
      await postsAPI.likePost(postId);
    } catch (error) {
      // Revert on failure
      setIsLiked(isLiked);
      setLikes(likes);
      console.error('Like failed', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentError('');

    try {
      const response = await postsAPI.addComment(postId, { text: commentText });
      const payload = response.data;
      const newComments = payload.comments
        ? payload.comments
        : payload.comment
        ? [...comments, payload.comment]
        : [...comments, payload];
      setComments(newComments);
      setCommentText('');
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to post comment.';
      setCommentError(message);
      console.error('Comment submit failed', error);
    }
  };

  const imageSrc = post.image?.startsWith('http')
    ? post.image
    : `http://localhost:5000${post.image}`;

  return (
    <Card className="mb-4 postCard shadow-sm">
      <Card.Header className="header bg-white border-0 pt-3">
        <div className="d-flex align-items-center">
          <div className="avatar">{avatarLetter}</div>
          <div className="userInfo ms-2">
            <span className="username fw-bold">{username}</span>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="body py-2">
        <Card.Text>{post.content}</Card.Text>
        {post.image && (
          <div className="imageContainer rounded overflow-hidden mb-2">
            <img 
              src={imageSrc} 
              alt="Post" 
              className="postImage w-100" 
            />
          </div>
        )}
      </Card.Body>

      <Card.Footer className="footer bg-white border-0 pb-3">
        <div className="actions d-flex gap-4">
          <button 
            className={`actionBtn border-0 bg-transparent ${isLiked ? 'text-danger' : 'text-muted'}`} 
            onClick={handleLike}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} /> 
            <span className="ms-1">{likes}</span>
          </button>
          <button 
            className="actionBtn border-0 bg-transparent text-muted" 
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} /> 
            <span className="ms-1">{comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-3">
            <div className="commentsList mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {comments.length > 0 ? (
                comments.map((c, i) => {
                  const commenter = typeof c.user === 'string'
                    ? c.user
                    : c.user?.email || 'User';
                  return (
                    <div key={c._id || i} className="small mb-2 p-2 bg-light rounded">
                      <strong>{commenter}:</strong> {c.text}
                    </div>
                  );
                })
              ) : (
                <div className="small text-muted">No comments yet.</div>
              )}
            </div>

            <Form onSubmit={handleCommentSubmit} className="d-flex gap-2">
              <Form.Control 
                size="sm" 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                placeholder="Add a comment..." 
              />
              <button type="submit" className="btn btn-primary btn-sm px-3">Post</button>
            </Form>
            {commentError && <div className="text-danger small mt-1">{commentError}</div>}
          </div>
        )}
      </Card.Footer>
    </Card>
  );
}