import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sun, Moon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import SignInOAuthButton from './SignInOAuthButton';

const isAdmin = false; // Replace with actual logic

const TopBar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2 sm:gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter text-primary select-none">
            Fixora
          </h1>
        </Link>

        {/* Auth & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-foreground/60 hover:text-primary transition-colors bg-foreground/5 hover:bg-foreground/10 border border-border/50"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-8 h-8 sm:w-9 sm:h-9 border border-primary/50',
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              {/* Clerk's native email sign-in popup */}
              <SignInButton mode="modal" forceRedirectUrl="/auth-callback" signUpForceRedirectUrl="/auth-callback">
                <button className="relative flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/50 hover:border-primary/30 transition-all duration-300 active:scale-95 group overflow-hidden">
                  <Mail className="w-4 h-4 text-foreground/80 relative z-10" />
                  <span className="font-bold text-foreground/90 relative z-10 tracking-wide text-[10px] sm:text-xs uppercase hidden xs:inline">Sign In</span>
                </button>
              </SignInButton>

              {/* Google OAuth */}
              <SignInOAuthButton />
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default TopBar;