import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';
import { Loader2, MessageSquare, Repeat2, Share2, Code, ArrowLeft, Send, Trash2, CheckCircle2, Heart, Terminal, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import LinkifiedText from '@/components/LinkifiedText';
import AIResponseCard from '@/components/AIResponseCard';
import { useUser, useAuth } from '@clerk/clerk-react';
import { formatRelativeTime } from '@/lib/utils';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { currentPost, fetchPostById, loading, fetchComments, comments, addComment, isCommenting, toggleLike, toggleCommentAuthorLike, updatePostStatus } = usePostStore();
  const { authUser } = useUserStore();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);

  const isDeveloper = authUser?.role === 'developer' || authUser?.role === 'admin';
  const isOwner = currentPost?.userId?._id === authUser?._id || currentPost?.userId?.clerkId === authUser?.clerkId;

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

  useEffect(() => {
    fetchPostById(id);
    fetchComments(id);
  }, [id, fetchPostById, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Ticket link copied to clipboard!");
    });
  };

  if (loading && !currentPost) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Issue Not Found</h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const statusStyle = getStatusStyles(currentPost.status);
  const isLiked = currentPost.likes?.includes(user?.id);

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          {/* Back Button */}
          <div className="p-4 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
            <Link to="/" className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">Issue Details</h1>
          </div>

          {/* Post Content */}
          <div className="p-6 border-b border-white/5">
            <div className="flex gap-4 mb-6">
              <Link to={`/profile/${currentPost.userId?.clerkId}`}>
                <Avatar className="w-12 h-12 border border-primary/20">
                  <AvatarImage src={currentPost.userId?.imageUrl} />
                  <AvatarFallback className="bg-primary/20 text-primary">{currentPost.userId?.fullname?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link to={`/profile/${currentPost.userId?.clerkId}`} className="font-bold hover:underline block">
                  {currentPost.userId?.fullname}
                </Link>
                <span className="text-sm text-foreground/40 font-mono">@{currentPost.userId?.username}</span>
              </div>
              <div className="ml-auto flex items-center gap-2 relative">
                {currentPost.assignedTo && (
                  <Link
                    to={`/profile/${currentPost.assignedTo.clerkId || currentPost.assignedTo._id}`}
                    className="text-[10px] font-bold tracking-wider text-blue-400/80 hover:text-blue-400 uppercase transition-colors mr-1"
                  >
                    @{currentPost.assignedTo.username}
                  </Link>
                )}

                <div
                  onClick={() => isDeveloper ? setIsStatusMenuOpen(!isStatusMenuOpen) : null}
                  className={`flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/5 select-none transition-colors ${isDeveloper ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${statusStyle.bg} ${statusStyle.shadow}`} />
                  <span className="text-[10px] font-bold tracking-wider text-foreground/60 uppercase mt-[1px]">
                    {statusStyle.label}
                  </span>
                </div>

                {isDeveloper && isStatusMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 flex flex-col gap-1.5 bg-card border border-border/50 rounded-xl p-2 shadow-2xl z-50 min-w-[120px]">
                    {currentPost.status === 'open' && (
                      <button
                        onClick={async () => { 
                          try {
                            await updatePostStatus(currentPost._id, 'in_progress'); 
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
                    {(currentPost.status === 'in_progress' || currentPost.status === 'resolved' || currentPost.status === 'critical') && (
                      <>
                        <button
                          onClick={async () => { 
                            try {
                              await updatePostStatus(currentPost._id, 'resolved'); 
                              toast.success("Issue marked as resolved!");
                            } catch (err) {
                              toast.error("Failed to update status.");
                            }
                            setIsStatusMenuOpen(false); 
                          }}
                          className={`w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-transparent hover:border-green-500/20 rounded-lg transition-colors ${currentPost.status === 'resolved' ? 'border-green-500/50' : ''}`}
                        >
                          Resolve
                        </button>
                        <button
                          onClick={async () => { 
                            try {
                              await updatePostStatus(currentPost._id, 'critical'); 
                              toast.success("Issue marked as critical!");
                            } catch (err) {
                              toast.error("Failed to update status.");
                            }
                            setIsStatusMenuOpen(false); 
                          }}
                          className={`w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 rounded-lg transition-colors ${currentPost.status === 'critical' ? 'border-red-500/50' : ''}`}
                        >
                          Critical
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-black mb-4 tracking-tight leading-tight">
              {currentPost.title}
            </h2>

            <div className="text-lg leading-relaxed text-foreground/80 mb-6 whitespace-pre-wrap">
              <LinkifiedText text={currentPost.description} />
            </div>

            {currentPost.code && (
              <div className="mt-6 w-full rounded-2xl overflow-hidden border border-border/50 bg-[#080812] shadow-inner relative">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-mono text-secondary/80 uppercase">snippet.js</span>
                  </div>
                  <button
                    onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                    className="text-xs text-foreground/40 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {isCodeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isCodeExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className={`transition-all duration-300 ease-in-out ${isCodeExpanded ? 'max-h-none p-6' : 'max-h-32 p-6 grayscale-[0.3] opacity-60 overflow-hidden'}`}>
                  <pre className="text-sm font-mono text-white leading-relaxed overflow-x-auto pb-2">
                    <code>{currentPost.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {currentPost.code && <div className="mb-6" />}

            <div className="py-4 border-y border-border/50 text-sm text-foreground/40 mt-6 flex gap-1.5 font-medium">
              <span className="hover:underline cursor-default">
                {new Date(currentPost.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
              <span>·</span>
              <span className="hover:underline cursor-default">
                {new Date(currentPost.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-6 text-foreground/40 mt-4">
              <button 
                onClick={() => toggleLike(currentPost._id)}
                className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-purple-500' : 'hover:text-purple-500'}`}
              >
                <div className={`p-2 rounded-full ${isLiked ? 'bg-pink-500/10' : 'hover:bg-pink-500/10'}`}>
                  <Repeat2 className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </div>
                <span className="text-sm font-bold">{currentPost.likes?.length || 0}</span>
              </button>
              <div className="flex items-center gap-2 group/comment hover:text-secondary cursor-pointer transition-colors">
                <div className="p-2 rounded-full group-hover/comment:bg-secondary/10">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">{comments.length}</span>
              </div>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* AI Badge Button */}
              <div
                onClick={() => setShowAiResponse(!showAiResponse)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer select-none ml-2 ${
                  showAiResponse 
                    ? 'bg-primary/50 border-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-105' 
                    : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 glow-primary'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${showAiResponse ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-[0.5px]">
                  {showAiResponse ? 'Hide Solution' : (currentPost.aiResponse ? 'View AI Solution' : 'Ask AI')}
                </span>
              </div>
            </div>

            {/* AI Response Card */}
            {showAiResponse && (
              <AIResponseCard 
                title={currentPost.title} 
                description={currentPost.description} 
                code={currentPost.code} 
                ticketId={currentPost._id}
                savedResponse={currentPost.aiResponse}
              />
            )}
          </div>

          {/* Comment Input */}
          <div className="p-6 border-b border-white/5">
            {isSignedIn ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    placeholder="Post your analytical comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-foreground/20 resize-none min-h-[40px] py-2"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={!commentText.trim() || isCommenting}
                      className="rounded-full bg-primary text-black font-bold px-6"
                    >
                      {isCommenting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reply"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center glass rounded-2xl border border-white/10 bg-white/5">
                <p className="text-foreground/40 font-medium italic">Please sign in to join the technical discussion.</p>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="flex flex-col divide-y divide-white/5">
            {comments.map((comment) => (
              <div key={comment._id} className="p-6 flex gap-4 hover:bg-white/[0.01] transition-colors">
                <Link to={`/profile/${comment.userId?.clerkId}`}>
                  <Avatar className="w-10 h-10 border border-white/10">
                    <AvatarImage src={comment.userId?.imageUrl} />
                    <AvatarFallback>{comment.userId?.fullname?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${comment.userId?.clerkId}`} className="font-bold hover:underline">
                      {comment.userId?.fullname}
                    </Link>
                    <span className="text-xs text-foreground/40 font-mono">@{comment.userId?.username}</span>
                    <div className="flex items-center gap-1">
                      {(comment.userId?.role === 'developer' || comment.userId?.role === 'admin') && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold ${comment.userId?.role === 'admin' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-primary/20 text-primary border-primary/50'} border uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.3)]`}>
                          {comment.userId?.role === 'admin' ? 'Admin' : 'Dev'}
                        </span>
                      )}
                      {comment.userId?.clerkId === currentPost?.userId?.clerkId && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                          Author
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-foreground/20">• {formatRelativeTime(comment.createdAt)}</span>
                    {comment.authorLiked && (
                      <span className="flex items-center gap-1 text-[10px] text-primary font-bold ml-2">
                        <CheckCircle2 className="w-3 h-3" /> Seen by Author
                      </span>
                    )}
                  </div>
                  <div className="text-foreground/80 leading-relaxed mb-2">
                    <LinkifiedText text={comment.content} />
                  </div>
                  
                  {isOwner && (
                    <button 
                      onClick={() => toggleCommentAuthorLike(comment._id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors p-1.5 rounded-lg ${comment.authorLiked ? 'text-primary bg-primary/10' : 'text-foreground/30 hover:bg-white/5 hover:text-primary'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.authorLiked ? 'fill-current' : ''}`} />
                      <span>{comment.authorLiked ? 'Seen' : 'Mark as Seen'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="p-20 text-center text-foreground/20">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium italic">No technical comments yet. Be the first to analyze!</p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default TicketDetailPage;
