import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Calendar, Link as LinkIcon, MapPin, Edit3, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { usePostStore } from '@/store/usePostStore';
import PostCard from '@/components/PostCard';
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';



const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, isLoaded } = useUser();
  const { getProfilePosts, profilePosts, loading: loadingPosts } = usePostStore();
  const { getUserProfile, userProfile, loading: loadingProfile } = useUserStore();

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    const targetUserId = id || currentUser?.id;

    if (!targetUserId) return;

    // Fetch posts
    getProfilePosts(targetUserId);

    // Fetch profile info (always fetch to get DB _id and latest info)
    getUserProfile(targetUserId);
  }, [id, currentUser]);

  // Determine which user data to display
  const displayUser = userProfile || (isOwnProfile ? {
    fullname: currentUser?.fullName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || currentUser?.username || "Authenticated User",
    imageUrl: currentUser?.imageUrl,
    username: currentUser?.username || currentUser?.firstName?.toLowerCase() || "user",
    createdAt: currentUser?.createdAt,
    clerkId: currentUser?.id
  } : null);


  console.log("Profile Posts:", displayUser?.fullname);

  const displayName = displayUser?.fullname || displayUser?.username;

  if (!isLoaded || (loadingProfile && !userProfile) || (id && !isOwnProfile && loadingProfile)) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!displayUser && !isOwnProfile && !loadingProfile) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
      <h1 className="text-2xl font-bold">User Not Found</h1>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-primary/20 via-card to-secondary/20 border-b border-border/50 relative">
            <div className="absolute -bottom-16 left-6 p-1 bg-background rounded-full border-4 border-background">
              <Avatar className="w-32 h-32">
                <AvatarImage src={displayUser?.imageUrl} />
                <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">
                  {displayUser?.fullname?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-6 pb-6 flex flex-col gap-4 border-b border-border/50">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">{displayUser?.fullname}</h1>
                <p className="text-foreground/50 text-lg">@{displayUser?.username || displayName.split(' ')[0].toLowerCase()}</p>
              </div>
              {isOwnProfile && (
                <Button variant="outline" className="rounded-full border-primary/50 text-primary hover:bg-primary/10">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            <p className="text-foreground/90 max-w-xl text-lg leading-relaxed">
              Software Developer. Building high-performance UIs and solving complex technical issues at STS.io.
            </p>

            <div className="flex flex-wrap gap-4 text-foreground/50 text-sm mt-2">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Earth</div>
              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(displayUser?.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* User Posts */}
          <div className="flex flex-col">
            <div className="px-6 py-4 border-b border-border/50 bg-white/5">
              <h2 className="text-xl font-bold text-primary">
                {isOwnProfile ? "Your Posted Issues" : `${displayName}'s Issues`}
              </h2>
            </div>

            {loadingPosts ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : profilePosts.length > 0 ? (
              profilePosts.map((post, idx) => (
                <PostCard key={post._id || `post-${idx}`} post={post} fullname={displayUser?.fullname} imageUrl={displayUser?.imageUrl} />
              ))
            ) : (
              <div className="p-12 text-center text-foreground/40 font-medium italic">
                {isOwnProfile ? "You haven't posted any issues yet." : "This user hasn't posted any issues yet."}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default ProfilePage;
