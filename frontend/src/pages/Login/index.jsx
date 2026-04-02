import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Sparkles } from 'lucide-react';
import { authAPI } from '../../services/api';
import './index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      Cookies.set('token', response.data.token, { expires: 7 }); 
      Cookies.set('userEmail', email, { expires: 7 });
      Cookies.set('userId', response.data.userId, { expires: 7 });
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please try again.');
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
            <h2 className="headline mt-3">3W Social</h2>
            <p className="text-muted">Join our curated community of creators.</p>
          </div>
          
          <Card className="p-4 p-md-5">
            <Form onSubmit={handleLogin}>
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
                <div className="d-flex justify-content-between">
                  <Form.Label className="formLabel">Password</Form.Label>
                </div>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {error && <div className="text-danger mb-3 text-center">{error}</div>}

              <Button variant="primary" type="submit" className="w-100 mt-2" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
            
            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/signup" className="signupLink">Signup</Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
