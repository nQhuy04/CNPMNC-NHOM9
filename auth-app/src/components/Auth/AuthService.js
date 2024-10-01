// src/components/Auth/AuthService.js
import axios from 'axios';

const AuthService = {
  register: (username, email, password) => {
    return axios.post('/v1/auth/register', { username, email, password });
  },
  login: (username, password) => {
    return axios.post('/v1/auth/login', { username, password });
  },
  logout: (token) => {
    return axios.post('/v1/auth/logout', { token });
  },
};

export default AuthService;
