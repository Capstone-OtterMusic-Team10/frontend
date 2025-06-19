import React, { useState } from 'react';
import { useNavigate } from "react-router";
import githubLogo from '../assets/github-mark-white.png'
import googleLogo from '../assets/web_light_rd_na.svg'


const LoginView = () => {
let navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'test@otter.com' && password === 'ottermusic') {
      setError('');
      navigate('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleOAuthLogin = (provider) => {
    alert(`Redirecting to ${provider} login...`);
    //needs actual path
  };

  const goBackHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="oauth-buttons">
          <button type="button" className="oauth google" onClick={() => handleOAuthLogin('Google')}>
            <img src={googleLogo} alt="Google" /> Sign in with Google
          </button>
          <button type="button" className="oauth github" onClick={() => handleOAuthLogin('GitHub')}>
            <img src={githubLogo} alt="GitHub" /> Sign in with GitHub
          </button>
        </div>

        <hr style={{ margin: '1.5rem 0' }} />

        {error && <p style={{ color: 'red'}}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Log In</button>
      </form>
      <div></div>
      <p class="signup-prompt">Don't have an account? <a href="/signup">Sign up</a>
    </p>
    <button
          type="button"
          id="backButton"
          onClick={goBackHome}
        >
          Back
        </button>
    </div>
  );
};

export default LoginView;