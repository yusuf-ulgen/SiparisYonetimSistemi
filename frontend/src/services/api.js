import axios from 'axios';

const API_URL = 'http://localhost:8082/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from storage (admin or staff)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('staffToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Parse JWT payload to get role without a library
export const getTokenRole = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('staffToken');
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1])).role;
    } catch { return null; }
};

export const isAdmin = () => getTokenRole() === 'ADMIN';
export const isStaff = () => ['ADMIN', 'STAFF'].includes(getTokenRole());

export default api;
