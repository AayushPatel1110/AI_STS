import { SignInButton, useSignIn } from '@clerk/clerk-react';
import React from 'react'
import { Button } from './ui/button';

const SignInOAuthButton = () => {
    const {signIn , isLoaded} = useSignIn();

    if(!isLoaded) {
        return null;
    }

  return (
    <>
    <Button variant='secondary' className='w-full text-white border-zinc-200 h-11' onClick={() => signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: `/sso-callback`,
      redirectUrlComplete: `/auth-callback`
    })}>
      Sign In with Google
    </Button> 
      
    </>
  )
}

export default SignInOAuthButton