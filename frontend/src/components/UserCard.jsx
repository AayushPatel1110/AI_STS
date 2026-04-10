import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ArrowUpRight, User as UserIcon } from 'lucide-react';

const UserCard = ({ user }) => {
  return (
    <div className="glass p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all border border-white/5">
      <Link to={`/profile/${user.clerkId}`}>
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-primary/20">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user.fullname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                {user.fullname}
              </h3>
              {user.role === 'developer' && (
                <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-primary/20 text-primary border border-primary/50 uppercase tracking-tighter">
                  Dev
                </span>
              )}
            </div>
            <p className="text-sm text-foreground/50">@{user.username}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
