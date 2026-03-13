import { create } from 'zustand';
import api from '../utils/api';

const useUserStore = create((set, get) => ({
    profile: null,
    addresses: [],
    selectedAddressId: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/customers/profile');
            const data = response.data.data;
            set({ 
                profile: data, 
                addresses: data.profile?.addresses || [],
                isLoading: false 
            });
            return data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateProfile: async (updateData) => {
        set({ isLoading: true });
        try {
            const response = await api.patch('/customers/profile', updateData);
            const data = response.data.data;
            set({ 
                profile: data, 
                addresses: data.profile?.addresses || [],
                isLoading: false 
            });
            return data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchAddresses: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/customers/addresses');
            set({ addresses: response.data.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    addAddress: async (newAddress) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/customers/addresses', newAddress);
            set({ addresses: response.data.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateAddress: async (id, updatedData) => {
        set({ isLoading: true });
        try {
            const response = await api.patch(`/customers/addresses/${id}`, updatedData);
            set({ addresses: response.data.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    removeAddress: async (id) => {
        set({ isLoading: true });
        try {
            const response = await api.delete(`/customers/addresses/${id}`);
            set({ addresses: response.data.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    selectAddress: (id) => set(() => ({
        selectedAddressId: id
    })),

    getSelectedAddress: () => {
        const state = get();
        return state.addresses.find(addr => addr.id === state.selectedAddressId) || state.addresses[0];
    },

    referralStats: null,
    fetchReferralStats: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/customers/referral-stats');
            set({ referralStats: response.data.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    }
}));

export default useUserStore;
