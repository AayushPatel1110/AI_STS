import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Bell, Repeat, MessageCircle, Activity, Loader2, CheckCircle2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotificationStore } from '@/store/useNotificationStore';
import { formatRelativeTime } from '@/lib/utils';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { notifications, fetchNotifications, loading, markAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    return () => {
      // Mark as read when leaving the page or after viewing them
      if (unreadCount > 0) {
        markAsRead();
      }
    };
  }, [fetchNotifications, unreadCount, markAsRead]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col">
          <div className="p-6 border-b border-border/50 backdrop-blur-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAsRead()}
                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
          
          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="p-20 flex justify-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem 
                  key={notification._id}
                  notification={notification}
                />
              ))
            ) : (
              <div className="p-20 flex flex-col items-center justify-center gap-4 text-foreground/20">
                <Bell className="w-16 h-16 opacity-50" />
                <p className="text-xl font-bold">No Notifications Yet</p>
                <p className="text-sm text-center">When someone interacts with your issues or comments, it will show up here.</p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

const NotificationItem = ({ notification }) => {
  const isUnread = !notification.read;

  const getIconAndColor = (type) => {
    switch(type) {
      case 'like':
        return { icon: Repeat, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'comment':
        return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'status_update':
        return { icon: Activity, color: 'text-primary', bg: 'bg-primary/10' };
      case 'message':
        return { icon: Send, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      default:
        return { icon: Bell, color: 'text-zinc-400', bg: 'bg-white/5' };
    }
  };

  const { icon: Icon, color, bg } = getIconAndColor(notification.type);
  const sender = notification.senderId;
  const linkTo = notification.type === 'message' ? '/messages' : (notification.ticketId ? `/ticket/${notification.ticketId._id}` : `/profile/${sender?.clerkId}`);

  return (
    <Link to={linkTo} className={`p-6 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 items-start group ${isUnread ? 'bg-primary/5' : ''}`}>
      <div className={`p-3 rounded-full ${bg}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
      </div>
      <div className="flex gap-3 items-center flex-1">
        <Avatar className="w-10 h-10 border border-border/50">
          <AvatarImage src={sender?.imageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary">{sender?.fullname?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <p className="text-foreground/90 group-hover:text-foreground transition-colors leading-relaxed">
            <span className="font-bold">{sender?.fullname}</span> {notification.message}
          </p>
          {notification.ticketId && (
             <p className="text-xs text-foreground/50 italic mt-0.5 max-w-sm truncate">
               "{notification.ticketId.title}"
             </p>
          )}
          <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/30 mt-2">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        {isUnread && (
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)] ml-4" />
        )}
      </div>
    </Link>
  );
};

export default NotificationsPage;
