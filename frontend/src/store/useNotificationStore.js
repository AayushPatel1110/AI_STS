import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("notifications");
            set({ 
                notifications: response.data, 
                unreadCount: response.data.filter(n => !n.read).length,
                loading: false 
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            set({ loading: false });
        }
    },

    markAsRead: async () => {
        try {
            await axiosInstance.patch("notifications/mark-read");
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    },

    markMessagesAsRead: async (senderClerkId) => {
        set(state => {
            const updatedNotifications = state.notifications.map(n => 
                (n.type === 'message' && n.senderId?.clerkId === senderClerkId) 
                    ? { ...n, read: true } 
                    : n
            );
            return {
                notifications: updatedNotifications,
                unreadCount: updatedNotifications.filter(n => !n.read).length
            };
        });

        try {
            await axiosInstance.patch(`notifications/mark-read/${senderClerkId}`);
        } catch (error) {
            console.error("Error marking sender messages as read in DB:", error);
        }
    }
}));
