import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import PostCard from '@/components/PostCard';
import UserCard from '@/components/UserCard';
import { Search, Hash, Users, Ticket, Loader2, Sparkles, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('tickets');
  const [allUsers, setAllUsers] = useState([]);
  const { posts, fetchPosts, fetchingPosts: postsLoading } = usePostStore();
  const { getUsers, loading: usersLoading } = useUserStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchPosts();
      const users = await getUsers();
      setAllUsers(users);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchPosts, getUsers]);

  const filteredTickets = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(user =>
    user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = postsLoading || usersLoading || isInitialLoading;

  const categories = ['Frontend', 'Backend', 'API', 'Database', 'Security'];

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      <TopBar />
      <MainLayout>
        <div className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
              Explore
            </h1>
            <p className="text-foreground/50 flex items-center gap-2 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-primary" />
              Discover technical issues and brilliant developers.
            </p>
          </div>

          {/* Search & Toggle Bar */}
          <div className="flex flex-col gap-4 sticky top-0 z-30 bg-background/80 backdrop-blur-xl py-3 sm:py-4 -my-4 border-b border-border/50">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 bg-card/40 border border-border/50 h-12 sm:h-14 text-md sm:text-lg rounded-xl sm:rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-xl"
                placeholder={`Search for ${searchMode === 'tickets' ? 'problems...' : 'developers...'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-foreground/40 hover:text-primary transition-all active:scale-90"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            <Tabs defaultValue="tickets" className="w-full" onValueChange={setSearchMode}>
              <TabsList className="bg-card/40 p-1 border border-border/50 glass rounded-xl w-full sm:w-fit h-auto flex gap-1">
                <TabsTrigger
                  value="tickets"
                  className="flex-1 sm:flex-none gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black transition-all font-medium text-xs sm:text-sm"
                >
                  <Ticket className="w-4 h-4" />
                  Issues
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="flex-1 sm:flex-none gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black transition-all font-medium text-xs sm:text-sm"
                >
                  <Users className="w-4 h-4" />
                  Developers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-6">
            {!searchQuery && searchMode === 'tickets' && (
              <div className="flex flex-col gap-3 sm:gap-4 mb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 px-1">
                  Popular Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchQuery(cat)}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 glass rounded-full border border-border/50 hover:bg-primary hover:text-black hover:border-primary transition-all text-xs sm:text-sm font-bold flex items-center gap-2 group shadow-sm active:scale-95"
                    >
                      <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary group-hover:text-black transition-colors" />
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : `Recently Active ${searchMode === 'tickets' ? 'Issues' : 'Users'}`}
              </h2>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-foreground/30">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="font-medium animate-pulse">Syncing with decentralized data...</p>
                </div>
              ) : searchMode === 'tickets' ? (
                <div className="flex flex-col">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <EmptyState icon={Ticket} text="No issues found matching your search." />
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1  gap-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <UserCard key={user.clerkId} user={user} />
                    ))
                  ) : (
                    <div className="col-span-full">
                      <EmptyState icon={Users} text="No developers found matching your search." />
                    </div>
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
    <p className="text-sm">Try using different keywords or clearing the search.</p>
  </div>
);

export default ExplorePage;
