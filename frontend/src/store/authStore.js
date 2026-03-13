import { create } from 'zustand';
import api from '../utils/api';
import { ROLES } from '../config/roles';

const getInitialUser = () => {
    try {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined') return null;
        return JSON.parse(user);
    } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return null;
    }
};

const useAuthStore = create((set) => ({
    user: getInitialUser(),
    isAuthenticated: !!localStorage.getItem('token'),
    role: getInitialUser()?.role || null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('Backend Login Raw Response:', response.data);
            
            // Handle different potential response structures robustly
            const user = response.data.data || response.data.user || response.data;
            const token = response.data.token;

            if (!user) {
                throw new Error('User data not found in response');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                isAuthenticated: true,
                role: user.role,
                isLoading: false
            });
            return user;
        } catch (err) {
            console.error('Frontend AuthStore Login Error Detail:', err);
            const data = err.response?.data;
            const message = data?.errors?.[0] || data?.message || err.message || 'Login failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, role: null });
    },

    signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/register-customer', userData);
            console.log('Backend Signup Raw Response:', response.data);
            
            // Handle different potential response structures robustly
            const user = response.data.data || response.data.user || response.data;
            const token = response.data.token;

            if (!user) {
                throw new Error('User object not found in the response');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                isAuthenticated: true,
                role: user.role,
                isLoading: false
            });
            return user;
        } catch (err) {
            console.error('Frontend AuthStore Signup Error Detail:', err);
            const data = err.response?.data;
            const message = data?.errors?.[0] || data?.message || err.message || 'Signup failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    checkAuth: () => {
        const user = getInitialUser();
        const token = localStorage.getItem('token');
        if (user && token) {
            set({ user, isAuthenticated: true, role: user.role });
        } else {
            set({ user: null, isAuthenticated: false, role: null });
        }
    }
}));

export default useAuthStore;
