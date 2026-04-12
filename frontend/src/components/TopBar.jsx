import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Input } from './ui/input';
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
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground/60 hover:text-primary transition-colors bg-white/5 hover:bg-white/10 border border-white/10"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isAdmin && (
            <Link to="/admin" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}

          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-primary/50"
                  }
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInOAuthButton />
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default TopBar;