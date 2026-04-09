import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Repeat2, Heart, Share, Terminal, ChevronDown, ChevronUp, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { usePostStore } from '@/store/usePostStore';
import { useUser } from '@clerk/clerk-react';
import { formatRelativeTime } from '@/lib/utils';

const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleLike, deletePost, updatePost } = usePostStore();
  const { user: currentUser } = useUser();
  const isLiked = post.likes?.some(id => id === currentUser?.id);
  const likeCount = post.likes?.length || 0;
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDescription, setEditDescription] = useState(post.description);
  const [editCode, setEditCode] = useState(post.code || '');
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = currentUser?.id && post.userId?.clerkId && currentUser.id === post.userId.clerkId;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
          await deletePost(post._id);
      } catch (e) {
          console.error(e);
      }
    }
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
        await updatePost(post._id, { title: editTitle, description: editDescription, code: editCode });
        setIsEditDialogOpen(false);
    } catch (e) {
        console.error(e);
    } finally {
        setIsSaving(false);
    }
  };

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
            
            {isOwner ? (
                <div className="flex items-center gap-1">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-primary">
                                <Edit3 className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Edit Post</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                                    <Input
                                        id="title"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="desc" className="text-sm font-medium">Description</label>
                                    <textarea
                                        id="desc"
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="code" className="text-sm font-medium flex items-center gap-2">
                                        <Terminal className="w-4 h-4"/> Code Snippet
                                    </label>
                                    <textarea
                                        id="code"
                                        className="flex min-h-[120px] font-mono w-full rounded-md border border-input bg-[#0d0d1a] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                        value={editCode}
                                        onChange={(e) => setEditCode(e.target.value)}
                                        placeholder="Optional code snippet..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleEditSave} disabled={isSaving}>Save Changes</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-red-500" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-primary">
                  <Share className="w-4 h-4" />
                </Button>
            )}
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
