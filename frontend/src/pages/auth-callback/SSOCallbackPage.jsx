import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SSOCallbackPage = () => {
  return (
    <div className='h-screen w-full flex bg-black items-center justify-center '>
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center gap-4 pt-6'>
          <div className="p-3 rounded-full bg-purple-500/5 mb-1">
            <Loader className='animate-spin size-6 text-purple-600' />
          </div>
          <h3 className='text-zinc-200 text-xl font-bold'>Redirecting</h3>
          <p className='text-sm text-zinc-500 pb-4 text-center'>Verifying your session with Clerk...</p>
          
          <div className="hidden">
            <AuthenticateWithRedirectCallback 
                signInForceRedirectUrl="/auth-callback" 
                signUpForceRedirectUrl="/auth-callback" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SSOCallbackPage;
