import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Sparkles } from 'lucide-react';
import { authAPI } from '../../services/api';
import './index.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.signup({ email, password });
      Cookies.set('token', response.data.token, { expires: 7 });
      Cookies.set('userEmail', email, { expires: 7 });
      Cookies.set('userId', response.data.userId, { expires: 7 });
      navigate('/');
    } catch (err) {
      console.error('Signup failed', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageContainer">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="formWrapper">
          <div className="text-center mb-4">
            <div className="logoContainer">
              <Sparkles size={32} color="white" />
            </div>
            <h2 className="headline mt-3">Create Account</h2>
            <p className="text-muted">Join our curated community of creators.</p>
          </div>
          
          <Card className="p-4 p-md-5">
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label className="formLabel">Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label className="formLabel">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formConfirmPassword">
                <Form.Label className="formLabel">Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {error && <div className="text-danger mb-3 text-center">{error}</div>}

              <Button variant="primary" type="submit" className="w-100 mt-2" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </Form>
            
            <div className="text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="loginLink">Login</Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
