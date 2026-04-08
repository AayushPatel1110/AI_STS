import React from 'react';
import { Search, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Input } from './ui/input';
import SignInOAuthButton from './SignInOAuthButton';

const isAdmin = false; // Replace with actual logic

const TopBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-black italic tracking-tighter text-primary select-none">
            StackX
          </h1>
        </Link>

        {/* Search (Twitter Style) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search issues, tags, or users..."
              className="pl-10 bg-white/5 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-full transition-all"
            />
          </div>
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-4">
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