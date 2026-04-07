import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCheckoutStore = create(
    persist(
        (set, get) => ({
            // Session Data
            serviceItems: [],    // Array of { serviceDetails, configuration, pricing, addons }
            serviceDetails: null, // Current drafting { id, title, image, basePrice, tailorId, tailorName }
            configuration: null,  // Current drafting { deliveryType, fabricSource, measurements, instructions }
            pricing: null,        // Current drafting { base, delivery, taxes, total, deliveryDays }
            addons: [],           // Current drafting Array of addon objects

            // Actions
            addServiceItem: (item) => set((state) => ({
                serviceItems: [...state.serviceItems, item]
            })),

            removeServiceItem: (index) => set((state) => ({
                serviceItems: state.serviceItems.filter((_, i) => i !== index)
            })),

            initializeCheckout: (data) => set({
                serviceDetails: data.service ? {
                    ...data.service,
                    tailorId: data.tailorId || null,
                    tailorName: data.tailorName || null
                } : null,
                configuration: data.config || null,
                pricing: data.pricing || null,
                addons: data.addons || []
            }),

            setTailor: (id, name) => set((state) => ({
                serviceDetails: state.serviceDetails
                    ? { ...state.serviceDetails, tailorId: id, tailorName: name }
                    : { tailorId: id, tailorName: name }
            })),

            clearCheckout: () => set({
                serviceItems: [],
                serviceDetails: null,
                configuration: null,
                pricing: null,
                addons: []
            })
        }),
        {
            name: 'checkout-session-storage',
            partialize: (state) => ({
                serviceItems: state.serviceItems,
                serviceDetails: state.serviceDetails,
                configuration: state.configuration,
                pricing: state.pricing,
                addons: state.addons
            }),
        }
    )
);

export default useCheckoutStore;
