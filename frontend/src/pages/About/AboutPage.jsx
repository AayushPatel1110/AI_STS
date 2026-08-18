import React, { useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import {
  Code2, Database, Server, Zap, Shield, Globe,
  Github, Linkedin, Mail,
  Layers, Cpu, Braces, Box, CheckCircle2, Sparkles, User
} from 'lucide-react';

const MAKER = {
  name: 'Aayush Patel',
  role: 'Full-Stack Developer',
  bio: 'Passionate about building scalable, user-centric applications. Created Fixora to streamline QA workflows and bridge the gap between developers and testers with AI-powered insights.',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=AP&backgroundColor=8b5cf6&textColor=ffffff',
  links: [
    { icon: Github, label: 'GitHub', href: 'https://github.com/AayushPatel1110', color: 'hover:text-white' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/aayushpatel1110', color: 'hover:text-sky-400' },
    { icon: Mail, label: 'Email', href: 'mailto:aayushpatel1110@gmail.com', color: 'hover:text-primary' },
  ],
};

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: Globe,
    color: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    techs: [
      { name: 'React 19', desc: 'UI library & component architecture' },
      { name: 'Vite', desc: 'Lightning-fast build tool & dev server' },
      { name: 'Tailwind CSS v4', desc: 'Utility-first styling system' },
      { name: 'Zustand', desc: 'Lightweight global state management' },
      { name: 'React Router v7', desc: 'Client-side navigation & routing' },
      { name: 'Lucide Icons', desc: 'Clean, consistent icon set' },
    ],
  },
  {
    category: 'Backend',
    icon: Server,
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    iconColor: 'text-violet-400',
    techs: [
      { name: 'Node.js', desc: 'JavaScript runtime environment' },
      { name: 'Express.js', desc: 'Minimal & flexible web framework' },
      { name: 'MongoDB', desc: 'NoSQL document database' },
      { name: 'Mongoose', desc: 'Elegant MongoDB object modeling' },
      { name: 'Socket.io', desc: 'Real-time bidirectional messaging' },
      { name: 'Clerk', desc: 'Authentication & user management' },
    ],
  },
  {
    category: 'AI & Services',
    icon: Cpu,
    color: 'from-fuchsia-500/20 to-pink-500/20',
    border: 'border-fuchsia-500/30',
    iconColor: 'text-fuchsia-400',
    techs: [
      { name: 'Google Gemini', desc: 'AI-powered ticket analysis & insights' },
      { name: 'Cloudinary', desc: 'Media storage & image transformations' },
      { name: 'Vercel', desc: 'Frontend hosting & edge deployments' },
      { name: 'Render', desc: 'Backend cloud hosting platform' },
    ],
  },
];

const FEATURES = [
  { icon: Zap, label: 'AI-Powered Analysis', desc: 'Gemini AI auto-analyses every ticket for root causes and fix suggestions' },
  { icon: Shield, label: 'Role-Based Access', desc: 'Reporters, developers, and admins each get tailored experiences' },
  { icon: Code2, label: 'Real-Time Messaging', desc: 'Socket.io powers live DMs and instant ticket notifications' },
  { icon: Database, label: 'Smart Filtering', desc: 'Filter issues by status - Open, In Progress, Critical, Resolved' },
  { icon: Layers, label: 'Rich Media Support', desc: 'Attach screenshots and files directly to tickets via Cloudinary' },
  { icon: Sparkles, label: 'Developer Picks', desc: 'Developers curate and manage their assigned issue queue' },
];

const AboutPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      el.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };
    const handleLeave = () => { el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'; };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => { el.removeEventListener('mousemove', handleMove); el.removeEventListener('mouseleave', handleLeave); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      <TopBar />
      <MainLayout>
        <div className="flex flex-col gap-10 p-4 sm:p-6 pb-16">
          <section
            ref={heroRef}
            style={{ transition: 'transform 0.15s ease-out' }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md p-8 sm:p-12 shadow-2xl"
          >
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <span className="ai-badge mb-2">About</span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-br from-primary via-fuchsia-400 to-sky-400 bg-clip-text text-transparent leading-tight">
                Fixora
              </h1>
              <p className="text-foreground/60 text-lg max-w-lg leading-relaxed">
                An AI-augmented issue tracking & QA collaboration platform built to turn chaos into clarity.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
                <span className="text-sm text-foreground/50 font-mono">v1.0.0 - Live</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionTitle icon={User} label="Made by" />
            <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)] transition-shadow duration-500">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 blur-md opacity-60 scale-105" />
                <img src={MAKER.avatar} alt={MAKER.name} className="relative w-24 h-24 rounded-full border-2 border-primary/50 shadow-xl object-cover" />
              </div>
              <div className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{MAKER.name}</h2>
                  <p className="text-primary font-semibold text-sm tracking-wide">{MAKER.role}</p>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed max-w-md">{MAKER.bio}</p>
                <div className="flex items-center gap-3 mt-1">
                  {MAKER.links.map(({ icon: Icon, label, href, color }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-foreground/50 ${color} transition-all duration-200 bg-foreground/5 hover:bg-foreground/10 border border-border/50 text-sm font-semibold`}>
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionTitle icon={Braces} label="Tech Stack" />
            <div className="grid grid-cols-1 gap-4">
              {TECH_STACK.map((group) => (
                <TechGroup key={group.category} group={group} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionTitle icon={Box} label="Key Features" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <FeatureCard key={f.label} feature={f} />
              ))}
            </div>
          </section>

          <div className="text-center text-foreground/30 text-xs font-mono mt-4 pb-4">
            Built with love by Aayush Patel - {new Date().getFullYear()}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 px-1">
    <Icon className="w-4 h-4 text-primary" />
    <h2 className="text-sm font-black uppercase tracking-[0.15em] text-foreground/50">{label}</h2>
  </div>
);

const TechGroup = ({ group }) => {
  const { category, icon: Icon, color, border, iconColor, techs } = group;
  return (
    <div className={`rounded-2xl border ${border} bg-gradient-to-br ${color} backdrop-blur-md p-5 flex flex-col gap-4`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-black text-base tracking-tight">{category}</h3>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
        {techs.map((tech) => (
          <div key={tech.name} className="flex items-start gap-2 bg-card/40 rounded-xl p-3 border border-border/30">
            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor} opacity-70`} />
            <div>
              <p className="text-sm font-bold leading-tight">{tech.name}</p>
              <p className="text-[11px] text-foreground/40 leading-snug mt-0.5">{tech.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ feature }) => {
  const { icon: Icon, label, desc } = feature;
  return (
    <div className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group cursor-default">
      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-[12px] text-foreground/50 leading-snug mt-0.5">{desc}</p>
      </div>
    </div>
  );
};

export default AboutPage;
