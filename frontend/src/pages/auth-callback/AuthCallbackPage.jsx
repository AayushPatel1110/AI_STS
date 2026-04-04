import { Card, CardContent } from '@/components/ui/card'
import { useUser } from '@clerk/clerk-react';
import { Loader } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthCallbackPage = () => {

  const { isLoaded , user } = useUser();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
  
  useEffect  (() => {

    if(!isLoaded || !user) return;  

    const syncUser = async () => {
      try {
        await axios.post(`${backendUrl}/auth/callback`, {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

      } catch (error) {
          console.error("Error in auth callback", error);
      } finally {
        navigate('/');
      }
  };
  syncUser();
  }, [isLoaded, user, navigate]);


  return (
    <div className='h-screen w-full flex bg-black items-center justify-center '>
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center gap-4 pt-6'>
          <Loader className='animate-spin size-6 text-purple-700' />
          <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
          <p className='text-sm text-zinc-400 pb-4'>Processing authentication...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage
