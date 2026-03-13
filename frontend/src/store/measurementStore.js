import { create } from 'zustand';
import api from '../utils/api';

const useMeasurementStore = create((set, get) => ({
    measurements: [],
    isLoading: false,
    error: null,

    fetchMeasurements: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/measurements');
            set({ measurements: response.data.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    addMeasurement: async (measurementData) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/measurements', measurementData);
            set(state => ({ 
                measurements: [...state.measurements, response.data.data],
                isLoading: false 
            }));
            return response.data.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    updateMeasurement: async (id, updatedData) => {
        set({ isLoading: true });
        try {
            const response = await api.put(`/measurements/${id}`, updatedData);
            set(state => ({
                measurements: state.measurements.map(m => m._id === id ? response.data.data : m),
                isLoading: false
            }));
            return response.data.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    deleteMeasurement: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/measurements/${id}`);
            set(state => ({
                measurements: state.measurements.filter(m => m._id !== id),
                isLoading: false
            }));
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    }
}));

export default useMeasurementStore;
