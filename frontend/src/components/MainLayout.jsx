import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { ScrollArea } from './ui/scroll-area';
import { usePostStore } from '@/store/usePostStore';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@/lib/utils';

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
    <div className="flex bg-background overflow-hidden max-w-7xl h-[calc(100vh-4rem)] mx-auto border-x border-border/50 relative">
      {/* Sidebar - Fixed Left */}
      <aside className="hidden sm:flex flex-col w-20 xl:w-72 border-r border-border/50">
        <Sidebar />
      </aside>

      {/* Main Feed - Scrollable Middle */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-border/50 pb-20 sm:pb-0">
        <ScrollArea className="flex-1 scrollbar-hide">
          {children}
        </ScrollArea>
      </main>

      {/* Widgets - Fixed Right */}
      <aside className="hidden lg:flex flex-col w-80 p-3 gap-6">
        <div className="glass rounded-2xl p-4 flex flex-col gap-4 max-h-[350px]">
          <h2 className="text-xl font-bold">High Priority Issues</h2>
          <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide pr-1">
            {[...posts]
              .filter((p) => p.status !== 'resolved')
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

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
};
// =================================================================================
const PriorityItem = ({ post }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'in_progress':
        return { color: 'bg-yellow-500', label: 'In Progress', bgClass: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-50' };
      case 'resolved':
        return { color: 'bg-green-500', label: 'Resolved', bgClass: 'bg-green-500/10 hover:bg-green-500/20 text-green-50' };
      case 'critical':
        return { color: 'bg-red-500', label: 'Critical', bgClass: 'bg-red-500/10 hover:bg-red-500/20 text-red-50' };
      default:
        return { color: 'bg-zinc-400', label: 'Open', bgClass: '' };
    }
  };

  const status = getStatusInfo(post.status);

  return (
    <div className={`flex flex-col p-2 my-1 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-white/10 ${status.bgClass}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-bold text-primary truncate group-hover:text-primary/80">
            {post.title}
          </span>
          <span className="text-[10px] text-foreground/20 font-mono mt-0.5">
            {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
            {post.likes?.length || 0} Repost
          </span>
          <div className="flex items-center gap-1">
            <div className={`w-1 h-1 rounded-full ${status.color} shadow-[0_0_5px_currentColor]`} />
            <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-tighter">
              {status.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border flex flex-col justify-between transition-all group overflow-hidden relative cursor-pointer ${isActive
      ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.1)] scale-[1.02]'
      : 'bg-card/50 border-border/50 hover:bg-card/80'
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
