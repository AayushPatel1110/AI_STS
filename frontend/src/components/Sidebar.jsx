import React from 'react';
import { Home, Compass, Bell, Mail, User, PlusCircle, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Mail, label: 'Messages', path: '/messages' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full py-6 gap-8">
      {/* Logo */}


      {/* Nav Items */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
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
      <div className="px-2">
        <Button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('input[placeholder="What\'s the issue title?"]')?.focus();
          }}
          className="w-full py-6 rounded-full bg-white hover:bg-black hover:text-white text-black font-bold text-lg  transition-all active:scale-95"
        >
          <PlusCircle className="xl:hidden w-6 h-6 " />
          <span className="hidden xl:block">Post Issue</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
