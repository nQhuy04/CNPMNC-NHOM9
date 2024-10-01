import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomeAdmin.css'; // Import CSS file for HomeAdmin

const HomeAdmin = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Lấy thông tin người dùng từ localStorage
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // In ra accessToken và refreshToken để kiểm tra
  console.log('AccessToken:', accessToken);
  console.log('RefreshToken:', refreshToken);

  // Function to refresh the token if needed
  const refreshAccessToken = async () => {
    try {
      console.log('Refreshing token with refreshToken:', refreshToken);
      const response = await axios.post('http://localhost:8000/v1/auth/refresh-token', {
        token: refreshToken,
      });
      console.log('New access token received:', response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken); // Save the new access token
      return response.data.accessToken; // Return the new token for further requests
    } catch (err) {
      setError('Error refreshing access token.');
      console.error('Error refreshing access token:', err);
      return null;
    }
  };

  // Function to fetch all users
  const fetchUsers = async (token) => {
    console.log('Fetching users with accessToken:', token);
    try {
      const response = await axios.get('http://localhost:8000/v1/user', {
        headers: {
          token: `Bearer ${token}`, // Send token via header
        },
      });
      console.log('Fetched users data:', response.data);
      setUsers(response.data); // Set users data
    } catch (err) {
      console.error('Error fetching users:', err);
      // Check if the token has expired, and try refreshing it
      if (err.response && err.response.status === 403) {
        console.log('Access token expired, refreshing...');
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          fetchUsers(newAccessToken); // Retry with the new access token
        }
      } else {
        setError('Error fetching users.');
      }
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/v1/user/${userId}`, {
        headers: {
          token: `Bearer ${accessToken}`, // Send token via header
        },
      });
      setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from state
      console.log('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user.');
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers(accessToken); // Fetch users only if the user is admin
    }
  }, [accessToken, userInfo]);

  if (!userInfo) {
    return <div>Please log in.</div>; // If not logged in, show message
  }

  return (
    <div className="home-admin-container">
      <h2>Welcome Admin!</h2>
      <h3>User Information:</h3>
      <p><strong>ID:</strong> {userInfo._id}</p>
      <p><strong>Username:</strong> {userInfo.username}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Is Admin:</strong> {userInfo.isAdmin ? 'Yes' : 'No'}</p>

      <h3>All Users:</h3>
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>Username:</strong> {user.username} | <strong>Email:</strong> {user.email}
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeAdmin;
