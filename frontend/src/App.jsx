import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login/index.jsx';
import Signup from './pages/Signup/index.jsx';
import Feed from './pages/Feed/index.jsx';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
