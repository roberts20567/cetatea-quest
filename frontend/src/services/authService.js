// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/teams/';

// Register team
const register = async (teamData) => {
  const response = await axios.post(API_URL + 'register', teamData);

  if (response.data) {
    localStorage.setItem('team', JSON.stringify(response.data));
  }

  return response.data;
};

// Login team
const login = async (teamData) => {
  const response = await axios.post(API_URL + 'login', teamData);

  if (response.data) {
    localStorage.setItem('team', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout team
const logout = () => {
  localStorage.removeItem('team');
};

export default { register, login, logout };