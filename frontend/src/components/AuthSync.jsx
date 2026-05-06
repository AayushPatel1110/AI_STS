import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthToken, axiosInstance } from "../lib/axios";
import { useUserStore } from "../store/useUserStore";
import { useChatStore } from "../store/useChatStore";

const AuthSync = () => {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const { getAuthUser } = useUserStore();
  const { connectSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    if (!userId) {
      setAuthToken(null);
      disconnectSocket();
      return;
    }
    
    getAuthUser(userId);
    
    // Connect socket if user is authenticated
    if (user?.id) {
      connectSocket(user.id);
    }

    // Create an interceptor that refreshes the token on every request
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Failed to refresh Clerk token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup interceptor and socket on unmount or logout
    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [userId, user?.id, getToken, getAuthUser, connectSocket, disconnectSocket]);

  return null;
};

export default AuthSync;

