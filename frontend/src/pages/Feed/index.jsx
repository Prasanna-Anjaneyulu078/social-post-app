import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../../components/CreatePost/index.jsx';
import PostCard from '../../components/PostCard/index.jsx';
import { postsAPI } from '../../services/api';
import './index.css';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userEmail = Cookies.get('userEmail') || 'User';
  const limit = 5;

  const fetchPosts = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await postsAPI.getPosts(pageNumber, limit);
      const data = response.data;
      const loadedPosts = Array.isArray(data)
        ? data
        : Array.isArray(data.posts)
        ? data.posts
        : [];

      setPosts(loadedPosts);
      setPage(data.page || pageNumber);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError('Failed to load posts.');
      console.error(error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate, limit]);

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  const handleCreatePost = async (content, image) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      await postsAPI.createPost(formData);
      await fetchPosts(page);
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to create post. Please try again.';
      setError(message);
      console.error(error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="feedPage">
      <header className="header p-3 bg-white border-bottom mb-4">
        <Container className="d-flex justify-content-between align-items-center">
          <h2 className="m-0">3W Social</h2>
          <button className="btn btn-outline-danger btn-sm" onClick={() => { Cookies.remove('token'); navigate('/login'); }}>Logout</button>
        </Container>
      </header>
      <Container className="feedContainer">
        <CreatePost onPost={handleCreatePost} />
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="postsSection">
          {loading ? (
            <Spinner animation="border" className="d-block mx-auto" />
          ) : posts.length > 0 ? (
            posts.map((p) => <PostCard key={p._id} post={p} currentUserEmail={userEmail} />)
          ) : (
            <div className="no-posts-message text-center my-5 py-5 border rounded bg-light">
              <h5 className="text-muted">No posts yet</h5>
              <p className="text-secondary">Start the conversation by creating your first post!</p>
            </div>
          )}
        </div>

        {!loading && !error && (
          <div className="paginationWrapper d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}