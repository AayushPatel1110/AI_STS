import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set) => ({
    userProfile: null,
    authUser: null,
    loading: false,
    error: null,

    getAuthUser: async (id) => {
        try {
            const response = await axiosInstance.get(`users/profile/${id}`);
            set({ authUser: response.data });
        } catch (error) {
            console.error("Failed to fetch auth user:", error);
        }
    },

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

    getUsers: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("users");
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        } finally {
            set({ loading: false });
        }
    }
}));
