import React, { useState } from 'react';
import { useNavigate } from "react-router";


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

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
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
    </div>
  );
};

export default LoginView;