import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import PostCard from '@/components/PostCard';
import { Briefcase, Loader2, Sparkles, Ticket } from 'lucide-react';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';

const MyPicksPage = () => {
  const { posts, fetchPosts, fetchingPosts } = usePostStore();
  const { authUser } = useUserStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const loadData = async () => {
      await fetchPosts();
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchPosts]);

  // Filter posts where the authUser is assigned to the ticket
  let displayedTickets = posts.filter((post) =>
    post.assignedTo && post.assignedTo.clerkId === authUser?.clerkId
  );

  // Apply status filter
  if (filterStatus !== 'all') {
    displayedTickets = displayedTickets.filter(post => post.status === filterStatus);
  }

  // Apply sorting
  displayedTickets.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const isLoading = fetchingPosts || isInitialLoading;

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      <TopBar />
      <MainLayout>
        <div className="p-6 flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              My Picks
            </h1>
            <p className="text-foreground/50 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Tickets you are currently working on.
            </p>
          </div>

          {/* Filters & Sorting Scrollable Bar */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 py-2 border-b border-border/50 -mt-2 pb-4">
            <div className="flex items-center gap-2 pr-4 border-r border-border/50">
              {['newest', 'oldest'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortOrder(sort)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortOrder === sort ? 'bg-primary text-black ' : 'bg-white/5 text-foreground/70 hover:bg-white/10'}`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pl-2">
              {['all', 'in_progress', 'resolved', 'critical'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${filterStatus === status ? 'bg-primary text-black' : 'bg-white/5 text-foreground/70 hover:bg-white/10'}`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">
                Your Assigned Issues
              </h2>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-foreground/30">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="font-medium animate-pulse">Loading your picked tickets...</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {displayedTickets.length > 0 ? (
                    displayedTickets.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <EmptyState icon={Ticket} text="No tickets match your filters." />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

const EmptyState = ({ icon: Icon, text }) => (
  <div className="py-20 flex flex-col items-center justify-center gap-4 text-foreground/20 border-2 border-dashed border-white/5 rounded-3xl">
    <Icon className="w-16 h-16 opacity-50" />
    <p className="text-xl font-bold">{text}</p>
    <p className="text-sm text-center max-w-md">Browse the Explore page or Home feed to find issues status 'Open' and click 'Take Issue' to add them to your picks.</p>
  </div>
);

export default MyPicksPage;
