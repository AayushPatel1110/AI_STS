import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ArrowUpRight, User as UserIcon } from 'lucide-react';

const UserCard = ({ user, onClick, isOnline, isSelected, hasUnread }) => {
  const content = (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="w-14 h-14 border-2 border-primary/20">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {user.fullname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></span>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-white group-hover:text-primary transition-colors">
            {user.fullname}
          </h3>
          {(user.role === 'developer' || user.role === 'admin') && (
            <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-primary/20 text-primary border-primary/50'} border uppercase tracking-tighter`}>
              {user.role === 'admin' ? 'Admin' : 'Dev'}
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/50">@{user.username}</p>
      </div>
    </div>
  );

  const cardStyle = `w-full text-left glass p-4 rounded-2xl flex items-center justify-between group transition-all border ${hasUnread ? 'bg-white/10 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.25)] animate-pulse' : (isSelected ? 'bg-white/10 border-primary/50' : 'hover:bg-white/10 border-white/5')}`;

  if (onClick) {
    return (
      <button 
        onClick={() => onClick(user)}
        className={cardStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cardStyle}>
      <Link to={`/profile/${user.clerkId}`}>
        {content}
      </Link>
    </div>
  );
};

export default UserCard;
