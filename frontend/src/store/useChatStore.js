import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const playNotificationSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (error) {
        console.log("Audio playback failed", error);
    }
};

export const useChatStore = create((set, get) => ({
    messages: [],
    conversations: [],
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
            
            playNotificationSound();
            
            const senderName = message.sender?.fullname || "Someone";
            const previewText = message.content.length > 30 ? message.content.substring(0, 30) + "..." : message.content;
            
            toast.success(`New message from ${senderName}`, {
                icon: '💬',
                duration: 4000,
                position: 'top-right',
            });
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

    fetchConversations: async () => {
        try {
            const response = await axiosInstance.get("messages/conversations");
            set({ conversations: response.data });
        } catch (error) {
            console.error("Error fetching conversations:", error);
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
