import axios from 'axios';

const api = axios.create({ 
  // Default to backend on localhost:5000 which is the common PORT used by the server
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
});

export default api;
