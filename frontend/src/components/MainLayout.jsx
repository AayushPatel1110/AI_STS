import React from 'react';
import Sidebar from './Sidebar';
import { ScrollArea } from './ui/scroll-area';
import { usePostStore } from '@/store/usePostStore';

const MainLayout = ({ children }) => {
  const { posts } = usePostStore();

  const openCount = posts.filter(p => !p.status || p.status === 'open').length;
  const inProgressCount = posts.filter(p => p.status === 'in_progress').length;
  const resolvedCount = posts.filter(p => p.status === 'resolved').length;
  const criticalCount = posts.filter(p => p.status === 'critical').length;
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
      <aside className="hidden lg:flex flex-col w-90 p-6 gap-6">
        <div className="glass rounded-2xl p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Trending Issues</h2>
          <div className="flex flex-col gap-3">
            <TrendingItem tag="#react-compiler" count="1.2k" />
            <TrendingItem tag="#tailwind-v4" count="850" />
            <TrendingItem tag="#clerk-auth" count="420" />
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <h2 className="text-xl font-bold py-1">QA Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Open" value={openCount} color="text-zinc-400" />
            <StatCard label="In Progress" value={inProgressCount} color="text-blue-500" />
            <StatCard label="Resolved" value={resolvedCount} color="text-green-500" />
            <StatCard label="Critical" value={criticalCount} color="text-red-500" />
          </div>
        </div>
      </aside>
    </div>
  );
};

const TrendingItem = ({ tag, count }) => (
  <div className="flex flex-col hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
    <span className="text-sm text-foreground/50">Trending</span>
    <span className="font-bold text-primary">{tag}</span>
    <span className="text-xs text-foreground/40">{count} issues</span>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className="bg-[#1a1a2e]/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between hover:bg-white/[0.04] transition-all group overflow-hidden relative">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full bg-current ${color} opacity-80 shadow-[0_0_10px_currentColor]`} />
      <span className="text-[11px] font-semibold tracking-wide text-foreground/50 uppercase group-hover:text-foreground/70 transition-colors">
        {label}
      </span>
    </div>
    <div className="text-3xl font-bold tracking-tight text-foreground/90 mt-2">
      {value}
    </div>
  </div>
);

export default MainLayout;
