import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { usePostStore } from '@/store/usePostStore';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const { posts, fetchPosts, loading } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col">
          <CreatePost />

          <div className="flex flex-col">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, idx) => (
                <PostCard key={post._id || `post-${idx}`} post={post} />
              ))
            ) : (
              <div className="p-12 text-center text-foreground/40 font-medium italic">
                No tickets or issues posted yet. Be the first to raise a technical concern!
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default HomePage;
