import React from 'react';
import { Home, Compass, Bell, Mail, User, PlusCircle, MessageSquare, Briefcase } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import { useUserStore } from '@/store/useUserStore';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Mail, label: 'Messages', path: '/messages' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const Sidebar = () => {
  const { isSignedIn } = useAuth();
  const { authUser } = useUserStore();

  const developerItem = { icon: Briefcase, label: 'MyPicks', path: '/mypicks' };

  // Insert MyPicks after Explore if developer
  const items = authUser?.role === 'developer'
    ? [
        ...navItems.slice(0, 2),
        developerItem,
        ...navItems.slice(2)
      ]
    : navItems;

  return (
    <div className="flex flex-col h-full py-6 gap-8">
      {/* Logo */}


      {/* Nav Items */}
      <nav className="flex flex-col gap-2 flex-grow">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `side-nav-item mx-2 transition-all duration-300 ${isActive
                ? 'text-primary bg-primary/10 border-r-4 border-primary rounded-r-none'
                : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-lg hidden xl:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Post Button */}
      {isSignedIn && (
        <div className="px-2">
          <Button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              document.querySelector('input[placeholder="What\'s the issue title?"]')?.focus();
            }}
            className="w-full py-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <PlusCircle className="xl:hidden w-6 h-6 " />
            <span className="hidden xl:block">Post Issue</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
