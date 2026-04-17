import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Repeat2, Heart, Share, Terminal, ChevronDown, ChevronUp, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';
import { useUser } from '@clerk/clerk-react';
import { formatRelativeTime } from '@/lib/utils';

import LinkifiedText from './LinkifiedText';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleLike, deletePost, updatePost, updatePostStatus } = usePostStore();
  const { user: currentUser } = useUser();
  const { authUser } = useUserStore();
  const isLiked = post.likes?.some(id => id === currentUser?.id);
  const likeCount = post.likes?.length || 0;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDescription, setEditDescription] = useState(post.description);
  const [editCode, setEditCode] = useState(post.code || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const isOwner = currentUser?.id && post.userId?.clerkId && currentUser.id === post.userId.clerkId;
  const isDeveloper = authUser?.role === 'developer' || authUser?.role === 'admin';

  const getStatusStyles = (status) => {
    switch (status) {
      case 'in_progress':
        return { bg: 'bg-yellow-500', shadow: 'shadow-[0_0_12px_rgba(234,179,8,0.8)]', label: 'In Progress' };
      case 'resolved':
        return { bg: 'bg-green-500', shadow: 'shadow-[0_0_12px_rgba(34,197,94,0.8)]', label: 'Resolved' };
      case 'critical':
        return { bg: 'bg-red-500', shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.8)]', label: 'Critical' };
      case 'open':
      default:
        return { bg: 'bg-zinc-400', shadow: 'shadow-[0_0_12px_rgba(161,161,170,0.8)]', label: 'Open' };
    }
  };

  const statusStyle = getStatusStyles(post.status);

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

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/ticket/${post._id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Ticket link copied to clipboard!");
    });
  };

  const handleCardClick = () => {
    navigate(`/ticket/${post._id}`);
  };

  return (
    <Card
      className="border-b border-border/50 rounded-none bg-transparent hover:bg-white/[0.02] transition-colors group cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4 flex gap-4">
        {/* Avatar Area */}
        <div className="flex flex-col items-center">
          <Link
            to={`/profile/${post.userId?.clerkId || post.userId?._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="w-12 h-12 border border-primary/20">
              <AvatarImage src={post.userId?.imageUrl} />
              <AvatarFallback>{post.userId?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="w-[2px] flex-grow bg-border/30 my-2 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-2 relative">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={`/profile/${post.userId?.clerkId || post.userId?._id}`}
                  className="font-bold text-md text-foreground hover:underline cursor-pointer flex items-center gap-2 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.userId?.fullname}

                </Link>
                <label htmlFor="username" className="text-sm font-medium text-gray-500">@{post.userId?.username}</label>
                {(post.userId?.role === 'developer' || post.userId?.role === 'admin') && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${post.userId?.role === 'admin' ? 'bg-red-500/20 text-red-500 border-red-500/50 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-primary/20 text-primary border-primary/50 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'} border relative overflow-hidden uppercase tracking-wider`}>
                    {post.userId?.role === 'admin' ? 'Admin' : 'Dev'}
                  </span>
                )}
                <span className="text-foreground/40 text-lg whitespace-nowrap">· {formatRelativeTime(post.createdAt)}</span>
              </div>
              <div className="group/title">
                <h3 className="text-lg font-bold text-primary leading-tight mt-1 group-hover/title:underline cursor-pointer">{post.title}</h3>
              </div>
            </div>

            {isOwner ? (
              <div className="flex items-center gap-1 z-10">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-primary" onClick={(e) => e.stopPropagation()}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
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
                          <Terminal className="w-4 h-4 " /> Code Snippet
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
                <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-primary z-10" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
            )}
          </div>
          {/* Problem Text */}
          <div className="block">
            <p className="text-foreground/90 text-md leading-relaxed whitespace-pre-wrap">
              <LinkifiedText text={post.description} />
            </p>
          </div>

          {/* Code Snippet (StackOverflow Feature) */}
          {post.code && (
            <div className="mt-2 w-full rounded-xl overflow-hidden border border-border/50 bg-[#080812] shadow-inner relative z-10">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary/60" />
                  <span className="text-xs font-mono text-primary/60">snippet.js</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
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
          <div className="flex items-center justify-between max-w-md mt-6 text-foreground/50 z-10 relative">
            <Link
              to={`/ticket/${post._id}`}
              className="flex items-center gap-2 group/action hover:text-secondary transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 rounded-full group-hover/action:bg-secondary/10">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.commentCount || 0}</span>
            </Link>




            <div
              onClick={(e) => { e.stopPropagation(); toggleLike(post._id); }}
              className={`flex items-center gap-2 group/action transition-colors cursor-pointer ${isLiked ? 'text-purple-500' : 'hover:text-purple-500'}`}
            >
              <div className={`p-2 rounded-full ${isLiked ? 'bg-pink-500/10' : 'group-hover/action:bg-pink-500/10'}`}>
                <Repeat2 className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </div>

            <div className="flex items-center gap-2 relative">
              {post.assignedTo && (
                <Link
                  to={`/profile/${post.assignedTo.clerkId || post.assignedTo._id}`}
                  className="text-[10px] font-bold tracking-wider text-blue-400/80 hover:text-blue-400 uppercase transition-colors mr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{post.assignedTo.username}
                </Link>
              )}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDeveloper) setIsStatusMenuOpen(!isStatusMenuOpen);
                }}
                className={`flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/5 select-none transition-colors ${isDeveloper ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'}`}
              >
                <div className={`w-2 h-2 rounded-full ${statusStyle.bg} ${statusStyle.shadow}`} />
                <span className="text-[10px] font-bold tracking-wider text-foreground/60 uppercase mt-[1px]">
                  {statusStyle.label}
                </span>
              </div>

              {isDeveloper && isStatusMenuOpen && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex flex-col gap-1.5 bg-card border border-border/50 rounded-xl p-2 shadow-2xl z-50 min-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.status === 'open' && (
                    <button
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        try {
                          await updatePostStatus(post._id, 'in_progress'); 
                          toast.success("Issue taken successfully!");
                        } catch (err) {
                          toast.error("Failed to take issue.");
                        }
                        setIsStatusMenuOpen(false); 
                      }}
                      className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-transparent hover:border-blue-500/20 rounded-lg transition-colors"
                    >
                      Take Issue
                    </button>
                  )}
                  {post.status === 'in_progress' && (
                    <>
                      <button
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          try {
                            await updatePostStatus(post._id, 'resolved'); 
                            toast.success("Issue marked as resolved!");
                          } catch (err) {
                            toast.error("Failed to update status.");
                          }
                          setIsStatusMenuOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-transparent hover:border-green-500/20 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          try {
                            await updatePostStatus(post._id, 'critical'); 
                            toast.success("Issue marked as critical!");
                          } catch (err) {
                            toast.error("Failed to update status.");
                          }
                          setIsStatusMenuOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
                      >
                        Critical
                      </button>
                    </>
                  )}
                  {post.status === 'resolved' && (
                    <>
                      <button
                        onClick={async () => { 
                          try {
                            await updatePostStatus(post._id, 'resolved'); 
                            toast.success("Issue marked as resolved!");
                          } catch (err) {
                            toast.error("Failed to update status.");
                          }
                          setIsStatusMenuOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-transparent hover:border-green-500/20 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={async () => { 
                          try {
                            await updatePostStatus(post._id, 'critical'); 
                            toast.success("Issue marked as critical!");
                          } catch (err) {
                            toast.error("Failed to update status.");
                          }
                          setIsStatusMenuOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
                      >
                        Critical
                      </button>
                    </>
                  )}
                  {post.status === 'critical' && (
                    <>
                      <button
                        onClick={async () => { 
                          try {
                            await updatePostStatus(post._id, 'resolved'); 
                            toast.success("Issue marked as resolved!");
                          } catch (err) {
                            toast.error("Failed to update status.");
                          }
                          setIsStatusMenuOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-transparent hover:border-green-500/20 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={async () => { 
                          try {
                            await updatePostStatus(post._id, 'critical'); 
                            toast.success("Issue marked as critical!");
                          } catch (err) {
                            toast.error("Failed to update status.");
                          }
                          setIsStatusMenuOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
                      >
                        Critical
                      </button>
                    </>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
