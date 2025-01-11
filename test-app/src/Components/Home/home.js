import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/athContext';
import './home.css';

const Home = () => {
  const { login, isAuthenticated, role } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'INSTRUCTOR') {
        navigate('/admins');
      } else if (role === 'STUDENT') {
        navigate('/user');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to EduLearn</h1>
        <p className="home-subtitle">Your Gateway to Quality Education</p>
        {error && <p className="error-message">{error}</p>}
        <form className="home-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="home-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="home-input"
            required
          />
          <div className="home-buttons">
            <button type="submit" className="home-button login">
              Login
            </button>
            <button
              type="button"
              className="home-button register"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
