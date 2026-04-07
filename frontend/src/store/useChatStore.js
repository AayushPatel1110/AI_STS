import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useChatStore = create((set, get) => ({
    messages: [],
    loading: false,
    socket: null,
    onlineUsers: [],

    connectSocket: (userId) => {
        if (get().socket?.connected) return;

        const socket = io(SOCKET_URL, {
            query: { userId },
        });
        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on("newMessage", (message) => {
            set((state) => ({
                messages: [...state.messages, message],
            }));
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

    fetchMessages: async (ticketId) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get(`messages/${ticketId}`);
            set({ messages: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            console.error("Error fetching messages:", error);
        }
    },

    sendMessage: async (messageData) => {
        try {
            const response = await axiosInstance.post("messages", messageData);
            set((state) => ({
                messages: [...state.messages, response.data],
            }));
            return response.data;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },
}));
