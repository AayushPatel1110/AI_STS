import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create((set, get) => ({
    posts: [],
    profilePosts: [],
    currentPost: null,
    comments: [],
    fetchingPosts: false,
    loading: false, // This is for single post detail
    isCreatingPost: false,
    isCommenting: false,
    error: null,
    statusFilter: null,

    setStatusFilter: (filter) => set({ statusFilter: filter }),

    fetchPosts: async () => {
        set({ fetchingPosts: true, error: null });
        try {
            const response = await axiosInstance.get("tickets");
            set({ posts: response.data, fetchingPosts: false });
        } catch (error) {
            set({ error: "Failed to fetch posts", fetchingPosts: false });
        }
    },

    createPost: async (postData) => {
        set({ isCreatingPost: true, error: null });
        try {
            const response = await axiosInstance.post("tickets/create", postData);
            const newPost = response.data;
            
            set((state) => ({
                posts: [newPost, ...state.posts.filter(p => p._id !== newPost._id)],
                profilePosts: [newPost, ...state.profilePosts.filter(p => p._id !== newPost._id)],
                isCreatingPost: false
            }));
            
            return newPost;
        } catch (error) {
            set({ error: "Failed to create post", isCreatingPost: false });
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
                profilePosts: state.profilePosts.map((post) => post._id === postId ? updatedPost : post),
                currentPost: state.currentPost?._id === postId ? { ...state.currentPost, ...updatedPost } : state.currentPost
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
                profilePosts: state.profilePosts.map((post) => post._id === postId ? updatedPost : post),
                currentPost: state.currentPost?._id === postId ? { ...state.currentPost, ...updatedPost } : state.currentPost
            }));
            return updatedPost;
        } catch (error) {
            console.error("Error updating post status:", error);
            throw error;
        }
    },

    toggleLike: async (postId) => {
        const state = get();
        const postToLike = state.posts.find(p => p._id === postId) || state.profilePosts.find(p => p._id === postId) || (state.currentPost?._id === postId ? state.currentPost : null);
        if (!postToLike) return;

        // Note: For a true optimistic update we'd need the current user's ID
        // But even just updating the store with the response data is better with mapped updates.

        try {
            const response = await axiosInstance.patch(`tickets/${postId}/like`);
            const { likes } = response.data;

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? { ...post, likes } : post
                ),
                profilePosts: state.profilePosts.map((post) =>
                    post._id === postId ? { ...post, likes } : post
                ),
                currentPost: state.currentPost?._id === postId ? { ...state.currentPost, likes } : state.currentPost
            }));
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    },

    getProfilePosts: async (userId) => {
        set({ fetchingPosts: true, error: null });
        try {
            const response = await axiosInstance.get(`tickets/profile/${userId}`);
            set({ profilePosts: response.data, fetchingPosts: false });
            return response.data;
        } catch (error) {
            set({ error: "Failed to fetch profile posts", fetchingPosts: false });
            return [];
        }
    },

    fetchPostById: async (postId) => {
        set({ loading: true, error: null, currentPost: null });
        try {
            const response = await axiosInstance.get(`tickets/${postId}`);
            set({ currentPost: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch post", loading: false });
        }
    },

    fetchComments: async (postId) => {
        try {
            const response = await axiosInstance.get(`comments/${postId}`);
            set({ comments: response.data });
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    },

    addComment: async (ticketId, content) => {
        set({ isCommenting: true });
        try {
            const response = await axiosInstance.post("comments/create", { ticketId, content });
            set((state) => ({
                comments: [response.data, ...state.comments],
                isCommenting: false
            }));
        } catch (error) {
            console.error("Error adding comment:", error);
            set({ isCommenting: false });
        }
    },

    toggleCommentAuthorLike: async (commentId) => {
        try {
            const response = await axiosInstance.patch(`comments/${commentId}/author-like`);
            set((state) => ({
                comments: state.comments.map((c) =>
                    c._id === commentId ? { ...c, authorLiked: response.data.authorLiked } : c
                )
            }));
        } catch (error) {
            console.error("Error toggling comment author like:", error);
        }
    }
}));
