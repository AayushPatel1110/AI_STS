import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
// Auto-derive socket URL from backend URL (strips /api suffix).
// This way only VITE_BACKEND_URL needs to be set in Vercel dashboard.
const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.VITE_BACKEND_URL
        ? import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "").replace(/\/$/, "")
        : "http://localhost:5000");

const playNotificationSound = async () => {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        // Browsers suspend AudioContext until a user gesture occurs.
        // On Vercel (production) this causes silent failures — resume it explicitly.
        if (ctx.state === "suspended") {
            await ctx.resume();
        }

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
            // Must specify transports explicitly for Render (cloud WebSocket hosting).
            // 'websocket' first for speed; 'polling' as fallback if WS is blocked.
            transports: ["websocket", "polling"],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1500,
            timeout: 20000,
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
