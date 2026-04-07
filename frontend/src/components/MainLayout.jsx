import React from 'react';
import Sidebar from './Sidebar';
import { ScrollArea } from './ui/scroll-area';

const MainLayout = ({ children }) => {
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
      <aside className="hidden lg:flex flex-col w-80 p-6 gap-6">
        <div className="glass rounded-2xl p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Trending Issues</h2>
          <div className="flex flex-col gap-3">
            <TrendingItem tag="#react-compiler" count="1.2k" />
            <TrendingItem tag="#tailwind-v4" count="850" />
            <TrendingItem tag="#clerk-auth" count="420" />
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold">QA Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Solved" value="128" />
            <StatCard label="Pending" value="42" />
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

const StatCard = ({ label, value }) => (
  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
    <div className="text-2xl font-bold text-secondary">{value}</div>
    <div className="text-xs text-foreground/50">{label}</div>
  </div>
);

export default MainLayout;
