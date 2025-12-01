import axios from 'axios';

const API_URL = '/api/teams/';

// Get all teams (for admin)
const getAllTeams = async () => {
  const response = await axios.get(API_URL + 'admin/all');
  return response.data;
};

const startQuest = async () => {
  const response = await axios.post(API_URL + 'start');
  return response.data;
};

const getMyInfo = async () => {
  const response = await axios.get(API_URL + 'me');
  return response.data;
};

export default { getAllTeams, startQuest, getMyInfo };

