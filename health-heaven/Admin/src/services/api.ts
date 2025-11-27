import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/admin/login', { email, password });
  },
  
  verifyOTP: async (otp: string, tempToken: string) => {
    return api.post('/admin/verify-otp', 
      { otp },
      { headers: { Authorization: `Bearer ${tempToken}` } }
    );
  },
  
  resendOTP: async (tempToken: string) => {
    return api.post('/admin/resend-otp', 
      {},
      { headers: { Authorization: `Bearer ${tempToken}` } }
    );
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Admin services
export const adminService = {
  getDashboardData: async () => {
    return api.get('/admin/dashboard');
  },
  
  getProfile: async () => {
    return api.get('/admin/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return api.put('/admin/profile', profileData);
  }
};

export default api;