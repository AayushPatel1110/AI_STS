import React from 'react';
import { Home, Compass, Bell, Mail, User, PlusCircle, Briefcase, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';

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
  const { unreadCount, fetchNotifications } = useNotificationStore();

  React.useEffect(() => {
    if (isSignedIn) {
      fetchNotifications();
    }
  }, [isSignedIn, fetchNotifications]);

  const developerItem = { icon: Briefcase, label: 'MyPicks', path: '/mypicks' };
  const adminItem = { icon: Shield, label: 'Admin', path: '/admin' };

  // Insert items based on role
  let items = [...navItems];
  
  if (authUser?.role === 'developer' || authUser?.role === 'admin') {
    items.splice(2, 0, developerItem);
  }

  const isAdmin = authUser?.role === 'admin' || authUser?.email === import.meta.env.VITE_ADMIN_EMAIL;
  
  console.log("Sidebar Auth Check:", {
    email: authUser?.email,
    role: authUser?.role,
    envAdminMail: import.meta.env.VITE_ADMIN_EMAIL,
    isAdminResult: isAdmin 
  });

  if (isAdmin) {
    items.push(adminItem);
  }

  return (
    <div className="flex flex-col h-full py-6 gap-8">
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
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.label === 'Notifications' && unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] border-2 border-background" />
              )}
            </div>
            <span className="text-lg hidden xl:block flex-1">{item.label}</span>
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
            className="w-full py-6 rounded-full bg-primary hover:bg-primary/90 text-black font-black text-lg transition-all active:scale-95 shadow-2xl shadow-primary/30"
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
