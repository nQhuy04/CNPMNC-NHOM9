// src/components/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Auth/Home';
import HomeAdmin from './components/Auth/HomeAdmin';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<Login />}  />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/homeAdmin" element={<HomeAdmin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
