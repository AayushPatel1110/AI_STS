import React, { useState } from 'react';
import { Pencil, Image as ImageIcon, Send, Code, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePostStore } from '@/store/usePostStore';
import { useUser } from '@clerk/clerk-react';

const CreatePost = () => {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const { createPost, isCreatingPost } = usePostStore();

  const handlePost = async () => {
    if (!content.trim() || !title.trim()) return;
    try {
      await createPost({ title, description: content, code });
      setContent('');
      setTitle('');
      setCode('');
      setShowCode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 border-b border-border/50 bg-card/20 backdrop-blur-sm">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 border border-primary/20">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="bg-primary/20 text-primary font-bold">ME</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col gap-3">
          <input
            type="text"
            placeholder="What's the issue title?"
            className="w-full focus:outline-none bg-transparent border-none text-xl font-bold placeholder:text-primary/30 focus:ring-0 text-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Describe the technical problem..."
            className="w-full bg-transparent border-none text-lg placeholder:text-foreground/30 focus:ring-0 focus:outline-none resize-none min-h-[100px] text-foreground font-medium"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {showCode && (
            <div className="rounded-xl border border-border/50 overflow-hidden bg-black/40">
              <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 text-xs text-foreground/50 font-mono">
                <Code className="w-4 h-4" /> CODE SNIPPET
              </div>
              <textarea
                className="focus:outline-none text-white w-full bg-transparent p-4 font-mono text-sm text-secondary focus:ring-0 border-none min-h-[150px]"
                placeholder="// Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-border/20">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${showCode ? 'text-primary bg-primary/10' : 'text-foreground/40 hover:text-primary'}`}
                onClick={() => setShowCode(!showCode)}
              >
                <Code className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/40 hover:text-secondary">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/40 hover:text-secondary">
                <LinkIcon className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handlePost}
              disabled={isCreatingPost || !content.trim() || !title.trim()}
              className="bg-primary focus:outline-none hover:bg-primary/90 text-black px-8 rounded-full font-bold transition-all flex gap-2"
            >
              {isCreatingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Post Issue</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
