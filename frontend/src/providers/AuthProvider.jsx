import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import {axiosInstance} from "@/lib/axios";
import { Loader, Loader2 } from "lucide-react";

const updateApiToken = (token) => {
    if(token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}


const AuthProvider = ({children}) => {
    const { getToken , isSignedIn , isLoaded }= useAuth();
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);

            } catch (error) {
                console.error("Error fetching token:", error);
                updateApiToken(null);
            } finally {
                setLoading(false);
            }
        }
        initAuth();
    },[getToken]);
    if(Loading) {
        return(
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="size-8 text-purple-500 animate-spin"/>
            </div>

        );
    }
    return <>{children}</>

}
export default AuthProvider;