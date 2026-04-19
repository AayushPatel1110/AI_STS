import { axiosInstance } from '@/lib/axios';
import { useUser } from '@clerk/clerk-react';
import { Loader } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'react-hot-toast';

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const { getAuthUser } = useUserStore();
  const navigate = useNavigate();
  const syncStarted = React.useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || syncStarted.current) return;
    syncStarted.current = true;

    const syncUser = async () => {
      try {
        const syncPayload = {
          clerkId: user.id,
          fullname: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
          imageUrl: user.imageUrl,
          email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "",
        };
        
        console.log("Syncing user with email:", syncPayload.email);
        
        await axiosInstance.post('auth/sso-callback', syncPayload);
        
        // Refetch user data immediately to get the new role (admin/dev)
        await getAuthUser(user.id);
      } catch (error) {
        console.error("Error in auth callback:", error);
        toast.error(error.response?.data?.message || "Failed to sync user data. Please try again.");
      } finally {
        navigate('/');
      }
    };
    syncUser();
  }, [isLoaded, user, navigate, getAuthUser]);


  return (
    <div className='h-screen w-full flex bg-black items-center justify-center '>
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center gap-4 pt-6'>
          <div className="p-3 rounded-full bg-purple-500/5 mb-1">
            <Loader className='animate-spin size-6 text-purple-600' />
          </div>
          <h3 className='text-zinc-200 text-xl font-bold'>Logging you in</h3>
          <p className='text-sm text-zinc-500 pb-4 text-center'>Finishing up your authentication...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage
