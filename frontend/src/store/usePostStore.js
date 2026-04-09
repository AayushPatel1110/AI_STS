import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create((set, get) => ({
    posts: [],
    profilePosts: [],
    loading: false,
    error: null,
    statusFilter: null,

    setStatusFilter: (filter) => set({ statusFilter: filter }),

    fetchPosts: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("tickets");
            set({ posts: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch posts", loading: false });
        }
    },

    createPost: async (postData) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("tickets/create", postData);
            set((state) => {
                const newPost = response.data;
                const filteredPosts = state.posts.filter(p => p._id !== newPost._id);
                const filteredProfilePosts = state.profilePosts.filter(p => p._id !== newPost._id);
                
                return {
                    posts: [newPost, ...filteredPosts],
                    profilePosts: [newPost, ...filteredProfilePosts],
                    loading: false
                };
            });
            return response.data;
        } catch (error) {
            set({ error: "Failed to create post", loading: false });
            throw error;
        }
    },

    deletePost: async (postId) => {
        try {
            await axiosInstance.delete(`tickets/${postId}`);
            set((state) => ({
                posts: state.posts.filter(p => p._id !== postId),
                profilePosts: state.profilePosts.filter(p => p._id !== postId)
            }));
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },

    updatePost: async (postId, postData) => {
        try {
            const response = await axiosInstance.put(`tickets/${postId}`, postData);
            const updatedPost = response.data;
            set((state) => ({
                posts: state.posts.map((post) => post._id === postId ? updatedPost : post),
                profilePosts: state.profilePosts.map((post) => post._id === postId ? updatedPost : post)
            }));
            return updatedPost;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    },

    updatePostStatus: async (postId, status) => {
        try {
            const response = await axiosInstance.patch(`tickets/${postId}/status`, { status });
            const updatedPost = response.data;
            set((state) => ({
                posts: state.posts.map((post) => post._id === postId ? updatedPost : post),
                profilePosts: state.profilePosts.map((post) => post._id === postId ? updatedPost : post)
            }));
            return updatedPost;
        } catch (error) {
            console.error("Error updating post status:", error);
            throw error;
        }
    },

    toggleLike: async (postId) => {
        try {
            const response = await axiosInstance.patch(`tickets/${postId}/like`);
            const { likes } = response.data;

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? { ...post, likes } : post
                ),
                profilePosts: state.profilePosts.map((post) =>
                    post._id === postId ? { ...post, likes } : post
                )
            }));
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    },

    getProfilePosts: async (userId) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get(`tickets/profile/${userId}`);
            set({ profilePosts: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: "Failed to fetch profile posts", loading: false });
            return [];
        } finally {
            set({ loading: false });
        }
    }
}));
