import React, { useEffect, useState, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Search, Send, Loader2, X, ArrowLeft, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useChatStore } from '@/store/useChatStore';
import LinkifiedText from '@/components/LinkifiedText';
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import UserCard from "@/components/UserCard";

const MessagesPage = () => {
  const { user } = useUser();
  const { messages, fetchMessages, sendMessage, onlineUsers, conversations, fetchConversations } = useChatStore();
  const { notifications, fetchNotifications, markMessagesAsRead } = useNotificationStore();
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const { getUsers, loading } = useUserStore();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers();
      setAllUsers(users);
    };
    loadUsers();
    fetchConversations();
    fetchNotifications();
  }, [getUsers, fetchConversations, fetchNotifications]);

  const displayUsers = searchQuery
    ? allUsers.filter((u) =>
      u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : conversations;

  const hasUnreadMessage = (clerkId) => {
    return notifications.some(
      n => n.type === 'message' && !n.read && n.senderId?.clerkId === clerkId
    );
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    const content = newMessage;
    setNewMessage("");
    await sendMessage({
      content,
      ticketId: selectedUser.clerkId,
      receiverId: selectedUser.clerkId
    });
  };

  const handleUserSelect = (selectedUserObj) => {
    setSelectedUser(selectedUserObj);
    fetchMessages(selectedUserObj.clerkId);
    markMessagesAsRead(selectedUserObj.clerkId);
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  let lastDate = null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] text-foreground flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex-1 relative overflow-hidden">
        <MainLayout>
          <div className="flex h-[calc(100dvh-64px)] overflow-hidden max-w-7xl mx-auto w-full relative">
            {/* Contacts List */}
            <div className={`border-r border-white/5 flex-col bg-[#0d0d14]/40 backdrop-blur-xl z-20 
              ${selectedUser ? 'hidden md:flex' : 'flex'} 
              w-full md:w-1/3 md:max-w-[380px] md:min-w-[320px] transition-all`}>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Messages</h1>
                  <div className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors">
                    <MoreVertical className="w-5 h-5 text-white/40" />
                  </div>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-11 h-11 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-white/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 scrollbar-hide pb-10">
                {loading && !searchQuery ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : displayUsers.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {displayUsers.map((userObj) => (
                      <UserCard
                        key={userObj.clerkId}
                        user={userObj}
                        onClick={handleUserSelect}
                        isSelected={selectedUser?.clerkId === userObj.clerkId}
                        isOnline={onlineUsers.includes(userObj.clerkId)}
                        hasUnread={hasUnreadMessage(userObj.clerkId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/20 h-40 gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm">{searchQuery ? "No results found" : "No active conversations"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-[#0d0d14]/20 relative w-full overflow-hidden ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="h-[72px] shrink-0 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0d0d14]/60 backdrop-blur-md z-30">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative shrink-0">
                          <Avatar className="w-10 h-10 border border-white/10">
                            <AvatarImage src={selectedUser.imageUrl} />
                            <AvatarFallback>{selectedUser.fullname?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {onlineUsers.includes(selectedUser.clerkId) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0d0d14] rounded-full"></span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-sm md:text-base leading-tight truncate">{selectedUser.fullname}</h2>
                          <p className="text-[10px] md:text-xs text-white/40">
                            {onlineUsers.includes(selectedUser.clerkId) ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="text-white/40 hover:text-white rounded-full h-9 w-9">
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white/40 hover:text-white rounded-full h-9 w-9">
                        <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col scrollbar-hide relative min-h-0 w-full overflow-x-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="flex flex-col gap-4 relative z-10 w-full">
                      {messages.length > 0 ? (
                        messages.map((msg, idx) => {
                          const isMe = msg.sender?.clerkId === user?.id;
                          const msgDate = formatMessageDate(msg.createdAt);
                          const showDateHeader = msgDate !== lastDate;
                          lastDate = msgDate;

                          return (
                            <React.Fragment key={msg._id || idx}>
                              {showDateHeader && (
                                <div className="flex justify-center my-6">
                                  <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/40 border border-white/5 backdrop-blur-sm">
                                    {msgDate}
                                  </span>
                                </div>
                              )}
                              <div className={`flex ${isMe ? 'justify-end pr-2' : 'justify-start pl-2'} w-full mb-1`}>
                                <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                  <div className={`relative px-4 py-2.5 rounded-2xl shadow-xl transition-all ${isMe
                                      ? 'bg-blue-500/90 text-white rounded-tr-none'
                                      : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-white/5'
                                    }`}>
                                    <p className="text-[14px] md:text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                                      <LinkifiedText text={msg.content} />
                                    </p>
                                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                      <span className={`text-[10px] font-medium ${isMe ? 'text-white/70' : 'text-zinc-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4 mt-20">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Send className="w-8 h-8 opacity-20" />
                          </div>
                          <p className="text-sm font-medium">No messages yet</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} className="h-4 shrink-0" />
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-[#0d0d14]/80 backdrop-blur-xl border-t border-white/5 shrink-0">
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="text-white/40 hover:text-white rounded-full hidden sm:flex shrink-0">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 relative flex items-center min-w-0">
                        <Button variant="ghost" size="icon" className="absolute left-1 text-white/20 hover:text-white rounded-full h-8 w-8">
                          <Smile className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Input
                          className="w-full bg-white/5 border-white/10 focus-visible:ring-primary/50 h-11 pl-11 rounded-xl text-sm placeholder:text-white/20"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                      </div>
                      <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground w-11 h-11 rounded-xl flex items-center justify-center p-0 shrink-0 transition-transform active:scale-95 shadow-lg shadow-primary/20"
                      >
                        <Send className="w-5 h-5 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-6 p-6">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                    <Send className="w-10 h-10 text-primary/40 relative z-10" />
                  </div>
                  <div className="text-center relative z-10">
                    <h2 className="text-xl font-bold text-white/80 mb-2">Select a Conversation</h2>
                    <p className="text-sm max-w-[280px]">Choose a developer from the left to start chatting in real-time.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
};

export default MessagesPage;





