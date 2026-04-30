import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Bell, Mail, User, Briefcase, Shield } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const MobileNav = () => {
  const { authUser } = useUserStore();
  const { unreadCount } = useNotificationStore();

  const baseItems = [
    { icon: Home, path: '/' },
    { icon: Compass, path: '/explore' },
    { icon: Bell, path: '/notifications', showBadge: unreadCount > 0 },
    { icon: Mail, path: '/messages' },
    { icon: User, path: '/profile' },
  ];

  let items = [...baseItems];

  if (authUser?.role === 'developer' || authUser?.role === 'admin') {
    items.splice(2, 0, { icon: Briefcase, path: '/mypicks' });
  }

  if (authUser?.role === 'admin') {
    items.push({ icon: Shield, path: '/admin' });
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-2xl border-t border-border/50 px-4 py-3 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `relative p-2 transition-all duration-300 ${
              isActive ? 'text-primary scale-110' : 'text-foreground/50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="w-6 h-6" />
              {item.showBadge && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-background" />
              )}
              {/* Active Indicator */}
              <div 
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
