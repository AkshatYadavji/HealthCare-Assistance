import axios from 'axios';

// 1. Create a custom instance of Axios targeting your Node.js server port
const api = axios.create({
    baseURL: 'http://localhost:5000/api' // Points straight to your backend engine
});

// 2. THE INTERCEPTOR (The Token Passport): 
// This automatically runs right before ANY request leaves your frontend.
api.interceptors.request.use(
    (config) => {
        // Look inside your browser's local storage security vault
        const token = localStorage.getItem('token');
        
        // If a JWT token exists, stamp it onto the HTTP request headers automatically
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;