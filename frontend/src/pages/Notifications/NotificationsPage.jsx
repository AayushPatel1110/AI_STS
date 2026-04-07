import React from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Bell, Heart, MessageCircle, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col">
          <div className="p-6 border-b border-border/50 backdrop-blur-md">
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          
          <div className="divide-y divide-border/50">
            <NotificationItem 
              icon={Heart} 
              user={{ name: "Aayush Patel", avatar: "https://github.com/shadcn.png" }}
              text="liked your issue: Tailwind V4 @theme issue"
              time="2m"
              color="text-accent"
            />
            <NotificationItem 
              icon={MessageCircle} 
              user={{ name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" }}
              text="commented on your fix: Clerk Popover CSS"
              time="15m"
              color="text-primary"
            />
            <NotificationItem 
              icon={Star} 
              user={{ name: "Dev Team", avatar: "" }}
              text="Your fix was marked as 'Elite Solution'"
              time="1h"
              color="text-yellow-400"
            />
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

const NotificationItem = ({ icon: Icon, user, text, time, color }) => (
  <div className="p-6 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 items-start group">
    <Icon className={`w-6 h-6 mt-1 flex-shrink-0 ${color}`} />
    <div className="flex gap-3 items-center">
      <Avatar className="w-10 h-10 border border-primary/20">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-foreground/90 group-hover:text-foreground transition-colors">
          <span className="font-bold">{user.name}</span> {text}
        </p>
        <span className="text-sm text-foreground/40">{time} ago</span>
      </div>
    </div>
  </div>
);

export default NotificationsPage;
