import axios from 'axios';

const API_URL = '/api/teams/';

// Get all teams (for admin)
const getAllTeams = async () => {
  const response = await axios.get(API_URL + 'admin/all');
  return response.data;
};

export default { getAllTeams };

