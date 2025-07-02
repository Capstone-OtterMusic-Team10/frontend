import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import githubLogo from '../assets/github-mark-white.png'
import googleLogo from '../assets/web_light_rd_na.svg'

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    //fake success for now
    alert(`Signed up as ${form.username}`);
    navigate('/home');
  };

  const handleOAuthSignup = (provider) => {
    alert(`Redirecting to ${provider} signup...`);
     //needs actual path
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