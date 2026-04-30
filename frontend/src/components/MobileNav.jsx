import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Bell, Mail, User, Briefcase, Shield } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const MobileNav = () => {
  const { authUser } = useUserStore();
  const { unreadCount } = useNotificationStore();

  const baseItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Compass, path: '/explore', label: 'Explore' },
    ...(authUser ? [
      { icon: Bell, path: '/notifications', label: 'Alerts', showBadge: unreadCount > 0 },
      { icon: Mail, path: '/messages', label: 'Inbox' },
      { icon: User, path: '/profile', label: 'Profile' }
    ] : [])
  ];

  let items = [...baseItems];

  if (authUser?.role === 'developer' || authUser?.role === 'admin') {
    items.splice(2, 0, { icon: Briefcase, path: '/mypicks', label: 'Picks' });
  }

  if (authUser?.role === 'admin') {
    items.push({ icon: Shield, path: '/admin', label: 'Admin' });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-2xl border-t border-border/50 px-2 py-3 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-x-auto scrollbar-hide">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `relative flex items-center gap-2 p-2 transition-all duration-300 ${
              isActive ? 'text-primary' : 'text-foreground/50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative shrink-0">
                <item.icon className={`transition-transform duration-300 ${!authUser ? 'w-5 h-5' : 'w-6 h-6'} ${isActive ? 'scale-110' : ''}`} />
                {item.showBadge && (
                  <div className={`absolute rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-background ${!authUser ? '-top-1 -right-1 w-2 h-2' : 'top-0 right-0 w-2.5 h-2.5'}`} />
                )}
              </div>
              
              {!authUser && (
                <span className={`text-xs font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              )}

              {authUser && (
                <div 
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
