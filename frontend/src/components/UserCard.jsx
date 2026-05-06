import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const UserCard = ({ user, onClick, isOnline, isSelected, hasUnread }) => {
  const content = (
    <div className="flex items-center gap-3 w-full">
      <div className="relative shrink-0">
        <Avatar className={`w-12 h-12 border-2 transition-all duration-300 ${isSelected ? 'border-primary' : 'border-white/5'}`}>
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-white/5 text-white/40 text-xs font-bold">
            {user.fullname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0d0d14] rounded-full shadow-lg shadow-green-500/20"></span>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-semibold text-sm truncate transition-colors ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
            {user.fullname}
          </h3>
          {hasUnread && (
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)] animate-pulse" />
          )}
        </div>
        <div className="flex items-center justify-between">
           <p className="text-xs text-white/30 truncate">@{user.username}</p>
           {(user.role === 'developer' || user.role === 'admin') && (
            <span className={`px-1 py-0.5 rounded-[4px] text-[8px] font-bold ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'} border uppercase tracking-wider`}>
              {user.role === 'admin' ? 'Admin' : 'Dev'}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const cardStyle = `w-full text-left p-3 rounded-xl flex items-center transition-all duration-200 group relative overflow-hidden ${
    isSelected 
      ? 'bg-white/10 shadow-lg shadow-black/20 translate-x-1' 
      : 'hover:bg-white/5'
  }`;

  if (onClick) {
    return (
      <button 
        onClick={() => onClick(user)}
        className={cardStyle}
      >
        {isSelected && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
        {content}
      </button>
    );
  }

  return (
    <div className={cardStyle}>
      <Link to={`/profile/${user.clerkId}`} className="w-full">
        {content}
      </Link>
    </div>
  );
};

export default UserCard;

