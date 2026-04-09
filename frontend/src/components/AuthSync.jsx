import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthToken, axiosInstance } from "../lib/axios";
import { useUserStore } from "../store/useUserStore";

const AuthSync = () => {
  const { getToken, userId } = useAuth();
  const { getAuthUser } = useUserStore();

  useEffect(() => {
    if (!userId) {
      setAuthToken(null);
      return;
    }
    
    getAuthUser(userId);

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

    // Cleanup interceptor on unmount
    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [userId, getToken]);

  return null;
};

export default AuthSync;
