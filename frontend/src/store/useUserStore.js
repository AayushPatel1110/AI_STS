import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set) => ({
    userProfile: null,
    loading: false,
    error: null,

    getUserProfile: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`users/profile/${id}`);
            set({ userProfile: response.data, loading: false });
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            set({ error: error.response?.data?.message || "Failed to fetch user profile", loading: false });
            return null;
        }
    },

    updateUserProfile: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.put(`users/profile/${id}`, data);
            set({ userProfile: response.data, loading: false });
            return response.data;
        } catch (error) {
            console.error("Error updating user profile:", error);
            set({ error: error.response?.data?.message || "Failed to update user profile", loading: false });
            throw error;
        }
    },
}));
