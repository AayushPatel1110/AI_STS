import React, { useEffect, useState, useMemo } from 'react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUserStore } from '@/store/useUserStore';
import { 
    Users, Ticket, Code, CheckCircle, Trash2, 
    UserCog, Loader2, ExternalLink, Filter, Search, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const AdminPage = () => {
    const { 
        users, tickets, stats, isLoading, 
        fetchStats, fetchUsers, fetchTickets, 
        updateUserRole, deleteUser, deleteTicket, restoreUser
    } = useAdminStore();

    const [viewMode, setViewMode] = useState('users'); 
    const [userFilter, setUserFilter] = useState('all');
    const [ticketFilter, setTicketFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchTickets();
    }, [fetchStats, fetchUsers, fetchTickets]);

    const statCards = [
        { id: 'users', label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
        { id: 'developers', label: 'Developers', value: stats.developerCount, icon: Code, color: 'text-green-500' },
        { id: 'tickets', label: 'Total Tickets', value: stats.totalTickets, icon: Ticket, color: 'text-primary' },
        { id: 'resolved', label: 'Resolved', value: stats.resolvedTicketsCount, icon: CheckCircle, color: 'text-orange-500' },
    ];

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }) + ' ' + 
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const filteredUsers = useMemo(() => {
        let result = users;
        if (userFilter === 'developers') result = users.filter(u => u.role === 'developer');
        else if (userFilter === 'users') result = users.filter(u => u.role === 'user');
        else if (userFilter === 'admins') result = users.filter(u => u.role === 'admin');
        else if (userFilter === 'deleted') result = users.filter(u => u.isDeleted);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(u => u.fullname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
        }
        return result;
    }, [users, userFilter, searchQuery]);

    const filteredTickets = useMemo(() => {
        let result = tickets;
        if (ticketFilter !== 'all') {
            result = tickets.filter(t => t.status === ticketFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t => 
                (t.title?.toLowerCase() || "").includes(q) || 
                (t.userId?.fullname?.toLowerCase() || "").includes(q) ||
                (t.assignedTo?.fullname?.toLowerCase() || "").includes(q)
            );
        }
        return result;
    }, [tickets, ticketFilter, searchQuery]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
            <TopBar />
            <div className="max-w-7xl mx-auto flex">
                <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16 border-r border-white/5">
                    <Sidebar />
                </aside>

                <main className="flex-1 p-6 space-y-10">
                    <header className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-white/50 text-sm">Manage platform users and ticket life cycles.</p>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((stat) => (
                            <Card key={stat.id} className="bg-white/5 border-white/5 backdrop-blur-md rounded-3xl overflow-hidden group border transition-all duration-300">
                                <CardContent className="pt-6 pb-6 px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</p>
                                            <h3 className="text-3xl font-black">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                            <stat.icon className="w-6 h-6 antialiased" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* View Controls */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-6">
                           <div className="flex overflow-x-auto scrollbar-hide gap-3 py-2 border-b border-white/5 -mt-2 pb-5">
                                <div className="flex items-center gap-2 pr-6 border-r border-white/10">
                                    <button 
                                        onClick={() => { setViewMode('users'); setSearchQuery(''); }}
                                        className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'users' ? 'bg-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                    >
                                        Users
                                    </button>
                                    <button 
                                        onClick={() => { setViewMode('tickets'); setSearchQuery(''); }}
                                        className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'tickets' ? 'bg-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                    >
                                        Tickets
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 pl-3">
                                    {(viewMode === 'users' ? ['all', 'developers', 'users', 'admins', 'deleted'] : ['all', 'open', 'in_progress', 'resolved', 'critical']).map(f => (
                                        <button 
                                            key={f}
                                            onClick={() => viewMode === 'users' ? setUserFilter(f) : setTicketFilter(f)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                                                (viewMode === 'users' ? userFilter === f : ticketFilter === f) 
                                                ? 'bg-primary text-black' 
                                                : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                        >
                                            {f.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative max-w-lg w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <Input 
                                    placeholder={viewMode === 'users' ? "Search users..." : "Search tickets..."}
                                    className="bg-white/5 border-white/10 pl-11 h-12 rounded-2xl font-medium placeholder:text-white/20 border text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Data Matrix */}
                        <div className="flex flex-col gap-2">
                             <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">
                                Platform {viewMode === 'users' ? 'User Directory' : 'Ticket History'}
                            </h2>

                            <Card className="bg-white/5 border-white/5 rounded-[2.5rem] overflow-hidden border">
                                <CardContent className="p-0">
                                    {isLoading ? (
                                        <div className="py-24 flex flex-col items-center justify-center gap-4 text-white/10">
                                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                            <p className="font-bold tracking-widest text-[10px] uppercase animate-pulse">Syncing platform data...</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto min-h-[500px]">
                                            <Table>
                                                <TableHeader className="bg-white/[0.02]">
                                                    <TableRow className="border-white/5 hover:bg-transparent">
                                                        {viewMode === 'users' ? (
                                                            <>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest pl-10 py-6">User</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest">Role</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest">Joined</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest text-right pr-10">Control</TableHead>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest pl-10 py-6">Ticket</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest">Owner</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest">Developer</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest">Status</TableHead>
                                                                <TableHead className="text-white/30 uppercase text-[9px] font-black tracking-widest text-right pr-10">Action</TableHead>
                                                            </>
                                                        )}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(viewMode === 'users' ? filteredUsers : filteredTickets).length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={viewMode === 'users' ? 4 : 5} className="h-60 text-center text-white/10 font-bold uppercase tracking-widest text-sm">
                                                                No Records Found
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (viewMode === 'users' ? filteredUsers : filteredTickets).map((item) => (
                                                        <TableRow key={item._id} className="border-white/[0.03] hover:bg-white/[0.02] transition-all duration-300">
                                                            {viewMode === 'users' ? (
                                                                <>
                                                                    <TableCell className="pl-10">
                                                                        <div className="flex items-center gap-5 py-4">
                                                                            <Link to={`/profile/${item.clerkId || item._id}`} className="relative block">
                                                                                <img src={item.imageUrl} className="w-11 h-11 rounded-2xl border border-white/10 shadow-lg object-cover" alt="" />
                                                                                {item.isDeleted && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-black" />}
                                                                            </Link>
                                                                            <div className="flex flex-col">
                                                                                <Link to={`/profile/${item.clerkId || item._id}`} className="text-sm font-bold tracking-tight hover:text-primary transition-colors">{item.fullname}</Link>
                                                                                <span className="text-[10px] text-white/30 font-medium">{item.email}</span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase border tracking-widest ${
                                                                            item.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                            item.role === 'developer' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                            'bg-white/5 text-white/30 border-white/10'
                                                                        }`}>
                                                                            {item.role}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="text-white/20 text-[10px] font-medium font-mono">
                                                                        {formatTime(item.createdAt)}
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-10">
                                                                        <div className="flex justify-end gap-1.5 transition-all">
                                                                            {item.isDeleted ? (
                                                                                 <Button 
                                                                                    size="icon" 
                                                                                    variant="ghost" 
                                                                                    className="h-10 w-10 rounded-xl hover:bg-green-500/10 hover:text-green-500 transition-all active:scale-90"
                                                                                    onClick={() => restoreUser(item._id)}
                                                                                >
                                                                                    <RotateCcw className="w-5 h-5 font-bold" />
                                                                                </Button>
                                                                            ) : (
                                                                                <>
                                                                                    <Button 
                                                                                        size="icon" 
                                                                                        variant="ghost" 
                                                                                        className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                                                                                        onClick={() => updateUserRole(item._id, item.role === 'developer' ? 'user' : 'developer')}
                                                                                    >
                                                                                        <UserCog className="w-5 h-5" />
                                                                                    </Button>
                                                                                    <Button 
                                                                                        size="icon" 
                                                                                        variant="ghost" 
                                                                                        className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-90"
                                                                                        onClick={() => {
                                                                                            if(confirm('Are you sure you want to delete this user?')) deleteUser(item._id);
                                                                                        }}
                                                                                    >
                                                                                        <Trash2 className="w-5 h-5" />
                                                                                    </Button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <TableCell className="pl-10">
                                                                        <div className="flex flex-col gap-1 py-4">
                                                                            <span className="text-sm font-bold tracking-tight line-clamp-1">{item.title}</span>
                                                                            <span className="text-[9px] text-white/10 font-mono tracking-widest">{item._id.slice(0, 12)}...</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Link to={`/profile/${item.userId?.clerkId || item.userId?._id}`} className="flex items-center gap-3">
                                                                            <img src={item.userId?.imageUrl} className="w-8 h-8 rounded-xl border border-white/10 shadow-lg object-cover" alt="" />
                                                                            <span className="text-[11px] text-white/60 font-bold hover:text-primary transition-colors">{item.userId?.fullname}</span>
                                                                        </Link>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.assignedTo ? (
                                                                            <Link to={`/profile/${item.assignedTo?.clerkId || item.assignedTo?._id}`} className="flex items-center gap-3">
                                                                                <img src={item.assignedTo?.imageUrl} className="w-8 h-8 rounded-xl border border-white/10 shadow-lg object-cover" alt="" />
                                                                                <span className="text-[11px] text-green-500 font-bold hover:text-green-400 transition-colors">{item.assignedTo?.fullname}</span>
                                                                            </Link>
                                                                        ) : (
                                                                            <span className="text-[10px] text-white/5 font-bold italic">Unassigned</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                                                                            item.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                            item.status === 'open' ? 'bg-primary/10 text-primary border-primary/20' :
                                                                            item.status === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                            'bg-white/5 text-white/30 border-white/10'
                                                                        }`}>
                                                                            {item.status.replace('_', ' ')}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-10">
                                                                        <div className="flex justify-end gap-1.5 font-bold">
                                                                            <Button asChild size="icon" variant="ghost" className="h-10 w-10 outline-none rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                                                <Link to={`/ticket/${item._id}`}>
                                                                                    <ExternalLink className="w-5 h-5" />
                                                                                </Link>
                                                                            </Button>
                                                                            <Button 
                                                                                size="icon" 
                                                                                variant="ghost" 
                                                                                className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-90"
                                                                                onClick={() => {
                                                                                    if(confirm('Are you sure you want to delete this ticket?')) deleteTicket(item._id);
                                                                                }}
                                                                            >
                                                                                <Trash2 className="w-5 h-5" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
