import React from 'react';
import Sidebar from './Sidebar';
import { ScrollArea } from './ui/scroll-area';
import { usePostStore } from '@/store/usePostStore';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { posts, setStatusFilter, statusFilter, fetchPosts } = usePostStore();

  React.useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts.length, fetchPosts]);

  const openCount = posts.filter(p => !p.status || p.status === 'open').length;
  const inProgressCount = posts.filter(p => p.status === 'in_progress').length;
  const resolvedCount = posts.filter(p => p.status === 'resolved').length;
  const criticalCount = posts.filter(p => p.status === 'critical').length;

  const handleFilterClick = (status) => {
    if (statusFilter === status) {
      setStatusFilter(null);
    } else {
      setStatusFilter(status);
    }
  };
  return (
    <div className="flex bg-background overflow-hidden max-w-7xl max-h-[calc(100vh-4rem)] mx-auto border-x border-border/50">
      {/* Sidebar - Fixed Left */}
      <aside className="hidden sm:flex flex-col w-20 xl:w-72 border-r border-border/50">
        <Sidebar />
      </aside>

      {/* Main Feed - Scrollable Middle */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-border/50">
        <ScrollArea className="flex-1 scrollbar-hide">
          {children}
        </ScrollArea>
      </main>

      {/* Widgets - Fixed Right */}
      <aside className="hidden lg:flex flex-col w-80 p-3 gap-6">
        <div className="glass rounded-2xl p-4 flex flex-col gap-4 max-h-[350px]">
          <h2 className="text-xl font-bold">High Priority Issues</h2>
          <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide pr-1">
            {[...posts]
              .sort((a, b) => {
                // First priority: Critical status
                if (a.status === 'critical' && b.status !== 'critical') return -1;
                if (b.status === 'critical' && a.status !== 'critical') return 1;

                // Second priority: Likes count
                const likesA = a.likes?.length || 0;
                const likesB = b.likes?.length || 0;
                if (likesB !== likesA) return likesB - likesA;
                
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .slice(0, 10)
              .map((post) => (
                <Link key={post._id} to={`/ticket/${post._id}`}>
                  <PriorityItem post={post} />
                </Link>
              ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between items-center py-1">
            <h2 className="text-xl font-bold">QA Stats</h2>
            {statusFilter && (
              <button
                onClick={() => setStatusFilter(null)}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Open"
              value={openCount}
              color="text-zinc-400"
              isActive={statusFilter === 'open'}
              onClick={() => handleFilterClick('open')}
            />
            <StatCard
              label="In Progress"
              value={inProgressCount}
              color="text-yellow-500"
              isActive={statusFilter === 'in_progress'}
              onClick={() => handleFilterClick('in_progress')}
            />
            <StatCard
              label="Resolved"
              value={resolvedCount}
              color="text-green-500"
              isActive={statusFilter === 'resolved'}
              onClick={() => handleFilterClick('resolved')}
            />
            <StatCard
              label="Critical"
              value={criticalCount}
              color="text-red-500"
              isActive={statusFilter === 'critical'}
              onClick={() => handleFilterClick('critical')}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};
// =================================================================================
const PriorityItem = ({ post }) => (
  <div className="flex flex-col hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors group">
    <div className="flex justify-between items-start">
      <span className="text-sm font-bold text-primary truncate max-w-[180px] group-hover:text-primary/80">
        {post.title}
      </span>
      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
        {post.likes?.length || 0} Likes
      </span>
    </div>
    <span className="text-[11px] text-foreground/40 mt-1">
      Posted {new Date(post.createdAt).toLocaleDateString()}
    </span>
  </div>
);

const StatCard = ({ label, value, color, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border flex flex-col justify-between transition-all group overflow-hidden relative cursor-pointer ${isActive
      ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]'
      : 'bg-[#1a1a2e]/50 border-white/5 hover:bg-white/[0.04]'
      }`}
  >
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full bg-current ${color} ${isActive ? 'opacity-100 scale-125' : 'opacity-80'} shadow-[0_0_10px_currentColor] transition-all`} />
      <span className={`text-[11px] font-semibold tracking-wide uppercase transition-colors ${isActive ? 'text-foreground/90' : 'text-foreground/50 group-hover:text-foreground/70'}`}>
        {label}
      </span>
    </div>
    <div className={`text-3xl font-bold tracking-tight mt-2 transition-colors ${isActive ? 'text-foreground' : 'text-foreground/90'}`}>
      {value}
    </div>
    {isActive && (
      <div className="absolute top-0 right-0 p-1">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
      </div>
    )}
  </div>
);

export default MainLayout;
