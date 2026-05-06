import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Calendar, MapPin, Edit3, Loader2, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@clerk/clerk-react';
import { usePostStore } from '@/store/usePostStore';
import PostCard from '@/components/PostCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import LinkifiedText from '@/components/LinkifiedText';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isLoaded } = useUser();
  const { getProfilePosts, profilePosts, fetchingPosts: loadingPosts, statusFilter } = usePostStore();
  const { getUserProfile, userProfile, loading: loadingProfile, updateUserProfile } = useUserStore();

  const filteredProfilePosts = statusFilter 
    ? profilePosts.filter(post => {
        if (statusFilter === 'open') return !post.status || post.status === 'open';
        return post.status === statusFilter;
      })
    : profilePosts;

  const isOwnProfile = !id || id === currentUser?.id;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const targetUserId = id || currentUser?.id;
    if (targetUserId) {
      getProfilePosts(targetUserId);
      getUserProfile(targetUserId);
    }
  }, [id, currentUser?.id, getProfilePosts, getUserProfile]);

  const displayUser = userProfile || (isOwnProfile ? {
    fullname: currentUser?.fullName || currentUser?.username || "User",
    imageUrl: currentUser?.imageUrl,
    username: currentUser?.username || "user",
    createdAt: currentUser?.createdAt,
    clerkId: currentUser?.id,
    role: 'user',
    bio: ''
  } : null);

  const handleEditProfileOpen = () => {
    setEditUsername(displayUser?.username || "");
    setEditBio(displayUser?.bio || "");
    setValidationError("");
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const targetId = id || currentUser?.id;
      await updateUserProfile(targetId, { username: editUsername, bio: editBio });
      setIsEditDialogOpen(false);
      getUserProfile(targetId); 
    } catch (e) {
      setValidationError(e.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || (loadingProfile && !userProfile)) return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </div>
  );

  if (!displayUser && !loadingProfile) return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-foreground/50">The profile you're looking for doesn't exist or is unavailable.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col w-full overflow-x-hidden">
          {/* Banner Section */}
          <div className="h-32 sm:h-48 bg-gradient-to-br from-primary/20 via-card to-secondary/10 border-b border-border/50 relative">
            <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6 p-1 bg-background rounded-full border-4 border-background shadow-xl">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage src={displayUser?.imageUrl} />
                <AvatarFallback className="bg-primary/20 text-primary text-3xl sm:text-4xl font-bold">
                  {displayUser?.fullname?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Header Info */}
          <div className="pt-14 sm:pt-20 px-4 sm:px-6 pb-6 flex flex-col gap-4 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-0.5 flex flex-wrap items-center gap-2">
                  <span className="truncate">{displayUser?.fullname}</span>
                  {(displayUser?.role === 'developer' || displayUser?.role === 'admin') && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      displayUser?.role === 'admin' 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                        : 'bg-primary/10 text-primary border-primary/20'
                    } border shrink-0 shadow-[0_0_15px_rgba(var(--primary),0.2)]`}>
                      {displayUser?.role}
                    </span>
                  )}
                </h1>
                <p className="text-foreground/40 text-sm sm:text-base font-medium">@{displayUser?.username}</p>
              </div>
              
              {isOwnProfile && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 transition-all active:scale-95 sm:w-auto w-full" onClick={handleEditProfileOpen}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-[#0d0d1a] border-white/10 rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                      <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Username</label>
                        <Input
                          value={editUsername}
                          onChange={(e) => {
                            setEditUsername(e.target.value);
                            if (validationError) setValidationError("");
                          }}
                          className={`bg-white/5 border-white/10 focus-visible:ring-primary ${validationError ? "border-red-500" : ""}`}
                        />
                        {validationError && (
                          <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{validationError}</span>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Bio</label>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-white/20"
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="ghost" className="rounded-xl" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSaveProfile} disabled={isSaving} className="rounded-xl px-6 shadow-lg shadow-primary/20">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="text-foreground/80 max-w-2xl text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {displayUser?.bio ? <LinkifiedText text={displayUser.bio} /> : <span className="italic text-foreground/30">No bio provided.</span>}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-foreground/40 text-xs sm:text-sm mt-1">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Earth</div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> 
                Joined {new Date(displayUser?.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* User Posts Section */}
          <div className="flex flex-col min-h-screen">
            <div className="px-4 sm:px-6 py-4 border-b border-border/50 bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                {isOwnProfile ? "Your Issues" : `${displayUser?.fullname}'s Issues`}
              </h2>
            </div>

            <div className="flex flex-col divide-y divide-border/30">
              {loadingPosts ? (
                <div className="p-16 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
              ) : filteredProfilePosts.length > 0 ? (
                filteredProfilePosts.map((post, idx) => (
                  <PostCard key={post._id || `post-${idx}`} post={post} />
                ))
              ) : (
                <div className="p-16 text-center text-foreground/30 flex flex-col items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-50">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <p className="text-sm font-medium italic">
                    {statusFilter 
                      ? `No issues found with status "${statusFilter}".`
                      : "No issues posted yet."
                    }
                  </p>
                </div>
              )}
            </div>
            {/* Spacer for mobile nav */}
            <div className="h-20 md:hidden" />
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default ProfilePage;

