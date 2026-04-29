import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { aiModel } from '@/lib/gemini';
import toast from 'react-hot-toast';

const AIResponseCard = ({ title, description, code, onComplete }) => {
  const [aiResponse, setAiResponse] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateResponse = async () => {
      if (!aiModel) {
        setError("AI Assistant not configured. Please check your API key.");
        return;
      }

      setIsAiGenerating(true);
      setAiResponse("");
      setError(null);

      try {
        const prompt = `Task: Issue Analysis & Code Fix
Issue: ${title}
Context: ${description}
Code: ${code || "None"}

Requirements:
1. One-sentence root cause.
2. Direct code improvement (Markdown).
3. Max 100 words total.`;

        // Optimized for token efficiency and speed
        const result = await aiModel.models.generateContentStream({
          model: "gemini-2.5-flash-lite",
          contents: prompt,
          generationConfig: {
            maxOutputTokens: 150, // Keep responses concise
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          }
        });

        let fullText = "";
        for await (const chunk of result) {
          const chunkText = chunk.text;
          if (chunkText) {
            fullText += chunkText;
            setAiResponse(fullText);
          }
        }
        if (onComplete) onComplete(fullText);
      } catch (err) {
        console.error("AI Generation Error:", err);
        setError("Failed to generate AI response. Please try again.");
        toast.error("AI assistant error.");
      } finally {
        setIsAiGenerating(false);
      }
    };

    generateResponse();
  }, [title, description, code]);

  if (error) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl overflow-hidden purple-glass relative z-10 animate-in fade-in slide-in-from-top-4 duration-500" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 py-3 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <span className="ai-badge">AI Response</span>
        </div>
        {isAiGenerating && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">Processing</span>
          </div>
        )}
      </div>
      <div className="p-5 response-content prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                    <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest">{match[1]}</span>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: '1.25rem', background: '#080812', fontSize: '13px', lineHeight: '1.6' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-primary/20 text-white px-1.5 py-0.5 rounded font-mono text-[13px] font-medium border border-primary/20" {...props}>
                  {children}
                </code>
              );
            },
            p: ({ children }) => <p className="mb-4 last:mb-0 text-foreground leading-relaxed text-[14px]">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-5 mb-4 text-foreground/90 space-y-2">{children}</ul>,
            li: ({ children }) => <li className="pl-1 text-foreground/90">{children}</li>,
            strong: ({ children }) => <strong className="text-white font-extrabold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{children}</strong>,
            h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-md font-bold text-white mb-2">{children}</h3>,
          }}
        >
          {aiResponse}
        </ReactMarkdown>
        {isAiGenerating && !aiResponse && (
          <div className="flex flex-col gap-2 opacity-50">
            <div className="h-3 w-3/4 bg-primary/20 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-primary/20 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-primary/20 rounded animate-pulse" />
          </div>
        )}
        {isAiGenerating && aiResponse && <span className="cursor-blink">|</span>}
      </div>
    </div>
  );
};

export default AIResponseCard;
