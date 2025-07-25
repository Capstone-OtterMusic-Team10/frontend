import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../utils"
import githubLogo from '../assets/github-mark-white.png';
import googleLogo from '../assets/web_light_rd_na.svg';

const SignupView = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const res = await api.post('/signup', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleOAuthSignup = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider.toLowerCase()}`;
  };

  return (
      <div className="signup-container">
        <button id="backButton" onClick={() => navigate('/')}>
          Back
        </button>

        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="oauth-buttons">
            <button type="button" className="oauth google" onClick={() => handleOAuthSignup('Google')}>
              <img src={googleLogo} alt="Google" /> Sign up with Google
            </button>
            <button type="button" className="oauth github" onClick={() => handleOAuthSignup('GitHub')}>
              <img src={githubLogo} alt="GitHub" /> Sign up with GitHub
            </button>
          </div>

          <hr style={{ margin: '1.5rem 0' }} />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
          /><br />

          <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
          /><br />

          <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
          /><br />

          <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
          /><br />

          <button type="submit">Create Account</button>
        </form>
      </div>
  );
};

export default SignupView;