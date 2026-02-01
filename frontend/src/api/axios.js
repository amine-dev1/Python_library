import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token but don't redirect (let components handle it)
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    // Don't redirect here - let the component handle navigation
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                case 404:
                    console.error('Not found:', error.response.data.detail);
                    break;
                case 500:
                    console.error('Server error:', error.response.data.detail);
                    break;
                default:
                    console.error('Error:', error.response.data.detail || error.message);
            }
        } else if (error.request) {
            console.error('Network error: No response received from server');
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
