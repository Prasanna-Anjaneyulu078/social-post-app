import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Auto-attach JWT token from cookies for every request
API.interceptors.request.use((config) => {
  const token = Cookies.get('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
};

export const postsAPI = {
  getPosts: (page = 1, limit = 5) => API.get(`/posts?page=${page}&limit=${limit}`),
  createPost: (formData) => API.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  likePost: (id) => API.put(`/posts/${id}/like`),
  addComment: (id, commentData) => API.post(`/posts/${id}/comment`, commentData),
  getComments: (id) => API.get(`/posts/${id}/comments`),
};

export default API;