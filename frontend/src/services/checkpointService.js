import axios from 'axios';

const API_URL = '/api/checkpoints/';

// Get all checkpoints for the logged-in user
const getCheckpoints = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a new checkpoint
const createCheckpoint = async (checkpointData) => {
  const response = await axios.post(API_URL, checkpointData);
  return response.data;
};

// Update a checkpoint
const updateCheckpoint = async (id, checkpointData) => {
  const response = await axios.put(API_URL + id, checkpointData);
  return response.data;
};

// Delete a checkpoint
const deleteCheckpoint = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data;
};

export default { getCheckpoints, createCheckpoint, updateCheckpoint, deleteCheckpoint };