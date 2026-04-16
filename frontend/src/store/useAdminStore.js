import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
    users: [],
    tickets: [],
    stats: {
        totalUsers: 0,
        totalTickets: 0,
        developerCount: 0,
        openTickets: 0,
    },
    isLoading: false,

    fetchStats: async () => {
        try {
            const res = await axiosInstance.get("/admin/stats");
            set({ stats: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch stats");
        }
    },

    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/admin/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTickets: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/admin/tickets");
            set({ tickets: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch tickets");
        } finally {
            set({ isLoading: false });
        }
    },

    updateUserRole: async (userId, role) => {
        try {
            const res = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
            set((state) => ({
                users: state.users.map((u) => (u._id === userId ? res.data : u)),
            }));
            const { fetchStats, fetchUsers } = useAdminStore.getState();
            await fetchStats();
            await fetchUsers(); // Re-sync user list
            toast.success(`User role updated to ${role}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    },

    deleteUser: async (userId) => {
        try {
            await axiosInstance.delete(`/admin/users/${userId}`);
            const { fetchStats, fetchUsers, fetchTickets } = useAdminStore.getState();
            await fetchStats();
            await fetchUsers();
            await fetchTickets();
            toast.success("User deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    },

    deleteTicket: async (ticketId) => {
        try {
            await axiosInstance.delete(`/admin/tickets/${ticketId}`);
            const { fetchStats, fetchTickets } = useAdminStore.getState();
            await fetchStats();
            await fetchTickets();
            toast.success("Ticket deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete ticket");
        }
    },

    restoreUser: async (userId) => {
        try {
            await axiosInstance.patch(`/admin/users/${userId}/restore`);
            const { fetchStats, fetchUsers } = useAdminStore.getState();
            await fetchStats();
            await fetchUsers();
            toast.success("User restored successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to restore user");
        }
    },
}));
