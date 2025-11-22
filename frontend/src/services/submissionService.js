import axios from 'axios';

const API_URL = '/api/submissions/';

// Create or update a submission
// formData will be a FormData object because it contains a file
const createOrUpdateSubmission = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

// Get all submissions for the current team
const getMySubmissions = async () => {
  const response = await axios.get(API_URL + 'my-submissions');
  return response.data;
};

// Get all submissions for a specific checkpoint (for admin)
const getSubmissionsForCheckpoint = async (checkpointId) => {
    const response = await axios.get(API_URL + `admin/by-checkpoint/${checkpointId}`);
    return response.data;
};

// Get all submissions for a specific team (for admin)
const getSubmissionsForTeam = async (teamId) => {
    const response = await axios.get(API_URL + `admin/by-team/${teamId}`);
    return response.data;
};

export default {
  createOrUpdateSubmission,
  getMySubmissions,
  getSubmissionsForCheckpoint,
  getSubmissionsForTeam
};