import axios from 'axios';

// Replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const registerUser = async (userData: {
  full_name: string;
  phone: string;
  country: string;
  gender: string;
  date_of_birth: string;
  profile_pic: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

// Summary API
export const getSummary = async (query: string) => {
  const response = await api.post('/summary', { query });
  return response.data;
};

// Profile APIs
export const getUserProfile = async (email: string) => {
  const response = await api.get(`/profile`, { params: { email } });
  return response.data;
};

export const updateUserProfile = async (data: {
  email: string;
  full_name?: string;
  country?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  profile_pic?: string;
}) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export default api;
