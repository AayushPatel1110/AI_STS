import React from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainLayout>
        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Explore</h1>
            <p className="text-foreground/50">Discover trending issues and top fixers.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
            <Input className="pl-12 bg-white/5 border-border/50 h-14 text-lg rounded-2xl" placeholder="Search for problems, tags, or users..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TopicCard title="Frontend" count="1.2k issues" color="text-primary" />
            <TopicCard title="Backend" count="850 issues" color="text-secondary" />
            <TopicCard title="DevOps" count="320 issues" color="text-accent" />
            <TopicCard title="Security" count="150 issues" color="text-red-400" />
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

const TopicCard = ({ title, count, color }) => (
  <div className="glass p-6 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-white/5 group">
    <h3 className={`text-xl font-bold mb-1 ${color} group-hover:scale-105 transition-transform`}>{title}</h3>
    <p className="text-sm text-foreground/40">{count}</p>
  </div>
);

export default ExplorePage;
