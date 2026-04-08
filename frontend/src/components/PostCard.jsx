import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Repeat2, Heart, Share, Terminal, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { usePostStore } from '@/store/usePostStore';
import { useUser } from '@clerk/clerk-react';
import { formatRelativeTime } from '@/lib/utils';

const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleLike } = usePostStore();
  const { user: currentUser } = useUser();
  const isLiked = post.likes?.some(id => id === currentUser?.id);
  const likeCount = post.likes?.length || 0;

  return (
    <Card className="border-b border-border/50 rounded-none bg-transparent hover:bg-white/[0.02] transition-colors group">
      <CardContent className="p-4 flex gap-4">
        {/* Avatar Area */}
        <div className="flex flex-col items-center">
          <Avatar className="w-12 h-12 border border-primary/20">
            <AvatarImage src={post.userId?.imageUrl} />
            <AvatarFallback>{post.userId?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="w-[2px] flex-grow bg-border/30 my-2 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={`/profile/${post.userId?.clerkId || post.userId?._id}`}
                  className="font-bold text-md text-foreground hover:underline cursor-pointer flex items-center gap-2"
                >
                  {post.userId?.fullname}

                </Link>
                <label htmlFor="username" className="text-sm font-medium text-gray-500">@{post.userId?.username}</label>
                {post.userId?.role === 'developer' && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] border border-primary/50 relative overflow-hidden uppercase tracking-wider">
                    Dev
                  </span>
                )}
                {post.status === 'closed' && (
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                )}
                <span className="text-foreground/40 text-lg whitespace-nowrap">· {formatRelativeTime(post.createdAt)}</span>
              </div>
              <h3 className="text-lg font-bold text-primary leading-tight mt-1">{post.title}</h3>
            </div>
            <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-primary">
              <Share className="w-4 h-4" />
            </Button>
          </div>
          {/* Problem Text */}
          <p className="text-foreground/90 text-md leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>

          {/* Code Snippet (StackOverflow Feature) */}
          {post.code && (
            <div className="mt-2 w-full rounded-xl overflow-hidden border border-border/50 bg-[#0d0d1a] shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-mono text-secondary/80">snippet.js</span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-foreground/40 hover:text-white flex items-center gap-1"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-height-none p-4' : 'max-h-24 p-4 grayscale-[0.5] opacity-60 overflow-hidden'}`}>
                <pre className="text-sm font-mono text-white leading-tight overflow-x-auto pb-2">
                  <code>{post.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Interaction Bar (Twitter Feature) */}
          <div className="flex justify-between max-w-md mt-4 text-foreground/50">
            <div className="flex items-center gap-2 group/action hover:text-secondary transition-colors cursor-pointer">
              <div className="p-2 rounded-full group-hover/action:bg-secondary/10">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </div>



            <div
              onClick={() => toggleLike(post._id)}
              className={`flex items-center gap-2 group/action transition-colors cursor-pointer ${isLiked ? 'text-purple-500' : 'hover:text-purple-500'}`}
            >
              <div className={`p-2 rounded-full ${isLiked ? 'bg-pink-500/10' : 'group-hover/action:bg-pink-500/10'}`}>
                <Repeat2 className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </div>

            <div className="flex items-center gap-2 group/action hover:text-primary transition-colors cursor-pointer">
              <div className="p-2 rounded-full group-hover/action:bg-primary/10">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.votes || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
