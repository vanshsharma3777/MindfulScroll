import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchTodayUsage = async () => {
  try {
    const response = await axios.get(`${API_URL}/usage/today`);
    return response.data;
  } catch (error) {
    console.error('Error fetching usage data:', error);
    throw error;
  }
};

export const clearData = async () => {
  try {
    console.log('Sending clear data request to:', `${API_URL}/usage/clear`);
    const response = await axios.delete(`${API_URL}/usage/clear`);
    console.log('Clear data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error clearing data:', error.response || error);
    throw error;
  }
}; 