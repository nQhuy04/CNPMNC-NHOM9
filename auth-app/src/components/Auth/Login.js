import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming the CSS file is already created

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/login', {
        username,
        password,
      });

      if (response.status === 200) {
        // Store the tokens and user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Set a success message
        setMessage('Login successful!');

        // Redirect based on admin status
        if (response.data.isAdmin) {
          navigate('/homeAdmin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      // Display error message from the server or a generic one
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage('Error logging in');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p><a href='/Register'>Đăng kí tại đây</a></p>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
};

export default Login;
