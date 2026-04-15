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
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-black italic tracking-tighter text-primary select-none">
            Fixora
          </h1>
        </Link>

        {/* Auth & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground/60 hover:text-primary transition-colors bg-white/5 hover:bg-white/10 border border-white/10"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
                  userButtonAvatarBox: 'w-9 h-9 border border-primary/50',
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            {/* Clerk's native email sign-in popup */}
            <SignInButton mode="modal">
              <button className="relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] active:scale-95 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Mail className="w-4 h-4 text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-white/90 relative z-10 tracking-wide text-sm">Sign In</span>
              </button>
            </SignInButton>

            {/* Google OAuth */}
            <SignInOAuthButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default TopBar;