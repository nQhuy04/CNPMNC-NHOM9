import React from 'react';
import './Home.css'; // Import CSS file

const Home = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Lấy thông tin người dùng từ localStorage
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!userInfo) {
    return <div className="message">Please log in.</div>; // Hiển thị thông báo nếu chưa đăng nhập
  }

  return (
    <div className="home-container">
      <h2>Welcome to Home Page!</h2>
 
    </div>
  );
};

export default Home;
