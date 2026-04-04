import {  LayoutDashboardIcon } from 'lucide-react';
import React from 'react'
import SignInOAuthButton from './SignInOAuthButton';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { SignOutButton } from '@clerk/clerk-react';
import { Button } from './ui/button';


const isAdmin = false; // Replace with actual logic to determine if the user is an admin


const TopBar = () => {
  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
         backdrop-blur-md z-10
        '>
      <div className='flex gap-2 items-center'>
        <b className='text-2xl font-bold'>Support Ticket System</b>
      </div>
      <div className='flex items-center gap-4'>
          {isAdmin &&(
            <Link to={"/admin"}>Admin
            <LayoutDashboardIcon className='size-5 mr-2' />
            Admin Dashboard
            </Link>
          )}

          <SignedIn>
                <div className='border text-1xl font-bold  p-2 bg-zinc-800 rounded-md '>
                  <SignOutButton />
                </div>
          </SignedIn>

          <SignedOut>
              <SignInButton>
                <Button variant='secondary' className='text-white border-zinc-200 h-11'>
                  Sign In with Email
                </Button>
              </SignInButton>  

            {/* //Google OAuth Sign In Button */}
            <div className="max-w-50 overflow-hidden">
              <SignInOAuthButton /> 
            </div>

          </SignedOut>
      </div>
    </div>
  )
}

export default TopBar