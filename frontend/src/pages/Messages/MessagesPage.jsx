import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import TopBar from '@/components/TopBar';
import { Search, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useChatStore } from '@/store/useChatStore';

const MessagesPage = () => {
  const { user } = useUser();
  const { messages, fetchMessages, sendMessage, connectSocket, disconnectSocket, onlineUsers } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    if (user) {
      connectSocket(user.id);
    }
    return () => disconnectSocket();
  }, [user, connectSocket, disconnectSocket]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedTicketId) return;
    await sendMessage({
      content: newMessage,
      ticketId: selectedTicketId,
      receiverId: "placeholder-receiver-id" 
    });
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <MainLayout>
        <div className="flex h-[calc(100vh-64px)]">
          {/* Contacts List */}
          <div className="w-80 border-r border-border/50 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input className="pl-10 bg-white/5 border-none rounded-full" placeholder="Search messages" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
              <div className="p-8 text-center text-foreground/40 italic text-sm">
                Select a ticket to view conversation history.
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-card/10">
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.sender?.clerkId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.sender?.clerkId === user?.id 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white/10 text-foreground rounded-tl-none'
                    }`}>
                      <p className="text-sm font-medium mb-1">{msg.sender?.fullname}</p>
                      <p>{msg.content}</p>
                      <span className="text-[10px] opacity-50 block mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-foreground/30 gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <Send className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium">Your Messages</p>
                  <p className="text-sm">Real-time chat functionality is active.</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border/50">
              <div className="flex gap-2">
                <Input 
                  className="flex-1 bg-white/5 border-none py-6 rounded-xl" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  onClick={handleSend}
                  className="bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-xl flex items-center justify-center p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default MessagesPage;
