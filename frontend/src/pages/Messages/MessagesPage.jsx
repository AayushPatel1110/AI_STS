import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Search, Send, Loader2, X, ArrowLeft } from 'lucide-react';
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
  const { messages, fetchMessages, sendMessage, connectSocket, disconnectSocket, onlineUsers, conversations, fetchConversations } = useChatStore();
  const { notifications, fetchNotifications, markMessagesAsRead } = useNotificationStore();
  const [newMessage, setNewMessage] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const { getUsers, loading } = useUserStore();

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers();
      setAllUsers(users);
    };
    if (user) {
      connectSocket(user.id);
    }
    loadUsers();
    fetchConversations();
    fetchNotifications();
    return () => disconnectSocket();
  }, [user, connectSocket, disconnectSocket, getUsers, fetchConversations, fetchNotifications]);
  
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
    await sendMessage({
      content: newMessage,
      ticketId: selectedUser.clerkId, // Use clerkId for direct messaging
      receiverId: selectedUser.clerkId
    });
    setNewMessage("");
  };

  const handleUserSelect = (selectedUserObj) => {
    setSelectedUser(selectedUserObj);
    setSelectedTicketId(selectedUserObj.clerkId); // Use user.clerkId as a conversation identifier
    fetchMessages(selectedUserObj.clerkId);
    markMessagesAsRead(selectedUserObj.clerkId); // Instantly remove the glow
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <MainLayout>
        <div className="flex h-[calc(100vh-64px)] overflow-hidden max-w-7xl mx-auto w-full relative">
          {/* Contacts List */}
          <div className={`border-r border-border/50 flex-col bg-background/50 backdrop-blur-sm z-10 
            ${selectedUser ? 'hidden md:flex' : 'flex'} 
            w-full md:w-1/3 md:max-w-[400px] md:min-w-[300px]`}>
            {/* Search Bar */}
            <div className="p-6 pb-2">
              <h1 className="text-2xl font-bold mb-6">Messages</h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 h-12 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4 pt-2 scrollbar-hide">
              {loading && !searchQuery ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : displayUsers.length > 0 ? (
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col items-center justify-center text-foreground/40 h-40">
                  <p>{searchQuery ? "No developers found" : "No active conversations"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex-1 flex-col bg-card/5 relative ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
            {selectedUser && (
              <div className="h-[88px] border-b border-border/50 flex items-center px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-10 gap-3">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarImage src={selectedUser.imageUrl} />
                      <AvatarFallback>{selectedUser.fullname?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {onlineUsers.includes(selectedUser.clerkId) && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{selectedUser.fullname}</h2>
                    <p className="text-sm text-foreground/60">{onlineUsers.includes(selectedUser.clerkId) ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide pb-32">
              {!selectedUser ? (
                <div className="flex-1 flex flex-col items-center justify-center text-foreground/30 gap-6 h-full">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <Send className="w-10 h-10 text-primary/50" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground/80 mb-2">Your Messages</h2>
                    <p className="text-base">Select a developer to start chatting.</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.sender?.clerkId === user?.id;
                  return (
                    <div key={msg._id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="w-10 h-10 border border-white/10 flex-shrink-0 mt-auto">
                        <AvatarImage src={msg.sender?.imageUrl} />
                        <AvatarFallback>{msg.sender?.fullname?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[65%]`}>
                        <div className={`p-4 rounded-2xl ${isMe
                          ? 'bg-primary text-primary-foreground rounded-br-sm shadow-lg shadow-primary/20'
                          : 'bg-white/10 text-foreground rounded-bl-sm border border-white/5'
                          }`}>
                          <p className="text-[15px] leading-relaxed"><LinkifiedText text={msg.content} /></p>
                        </div>
                        <span className="text-xs text-foreground/40 mt-2 px-1 font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-foreground/30 gap-4 h-full">
                  <p className="text-xl font-medium text-foreground/60">No messages yet</p>
                  <p className="text-base">Start a conversation with {selectedUser.fullname}!</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            {selectedUser && (
              <div className="absolute bottom-0 w-full p-4 md:p-6 bg-background/90 backdrop-blur-md border-t border-border/50 z-10">
                <div className="flex gap-3 md:gap-4 max-w-5xl mx-auto items-center">
                  <Input
                    className="flex-1 bg-white/5 border-white/10 focus-visible:ring-primary h-12 md:h-14 rounded-xl md:rounded-2xl px-4 md:px-6 text-sm md:text-base"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || !selectedUser}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center p-0 transition-transform active:scale-95"
                  >
                    <Send className="w-5 h-5 md:w-6 md:h-6 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default MessagesPage;


