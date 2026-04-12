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
        <div className="p-6 flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
              Explore
            </h1>
            <p className="text-foreground/50 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Discover technical issues and brilliant developers.
            </p>
          </div>

          {/* Search & Toggle Bar */}
          <div className="flex flex-col gap-4 sticky top-0 z-30 bg-background/80 backdrop-blur-xl py-4 -my-4 border-b border-border/50">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <Input
                className="pl-12 pr-12 bg-card/40 border-border/50 h-14 text-lg rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all shadow-2xl"
                placeholder={`Search for ${searchMode === 'tickets' ? 'problems, titles...' : 'names, usernames...'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 text-foreground/40 hover:text-primary transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <Tabs defaultValue="tickets" className="w-full" onValueChange={setSearchMode}>
              <TabsList className="bg-card/40 p-1 border border-border/50 glass rounded-xl w-fit h-auto flex gap-1">
                <TabsTrigger
                  value="tickets"
                  className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black transition-all font-medium"
                >
                  <Ticket className="w-4 h-4" />
                  Issues
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black transition-all font-medium"
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
              <div className="flex flex-col gap-4 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/30 px-1">
                  Popular Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchQuery(cat)}
                      className="px-4 py-2 glass rounded-full border border-border/50 hover:bg-primary hover:text-black hover:border-primary transition-all text-sm font-bold flex items-center gap-2 group shadow-sm active:scale-95"
                    >
                      <Hash className="w-3.5 h-3.5 text-primary group-hover:text-black transition-colors" />
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
                      <UserCard key={user._id} user={user} />
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
