import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthToken } from "../lib/axios";

const AuthSync = () => {
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const syncToken = async () => {
      if (userId) {
        try {
          const token = await getToken();
          console.log("TOKEN,", token)
          setAuthToken(token);
        } catch (err) {
          console.error("Error syncing auth token:", err);
        }
      } else {
        setAuthToken(null);
      }
    };

    syncToken();
  }, [userId, getToken]);

  return null;
};

export default AuthSync;
