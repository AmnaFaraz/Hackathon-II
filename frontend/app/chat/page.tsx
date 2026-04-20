"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Mic, Trash2, Copy, Plus, Menu, X, Bot, User, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCalls?: string[];
}

const SUGGESTED_PROMPTS = [
  "Add a high priority task: Fix login bug",
  "Show me all my pending tasks",
  "Complete my first task",
  "Delete all completed tasks",
];

export default function ChatPage() {
  const [userId, setUserId] = useState("demo-user");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userId");
    if (stored) setUserId(stored);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textOverride?: string) => {
    const text = textOverride || input.trim();
    if (!text || loading) return;

    const newMessage: Message = { 
      role: "user", 
      content: text, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat.send(userId, text, conversationId);
      setConversationId(res.conversation_id);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: res.response, 
          toolCalls: res.tool_calls,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, I couldn't connect to the backend. Please check your connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Navbar />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-bg-surface border-r border-border-primary pt-24 pb-6 transition-transform lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-4 h-full flex flex-col">
          <button className="flex items-center gap-2 w-full p-4 bg-bg-card border border-border-primary rounded-2xl text-text-primary font-bold hover:border-accent-primary transition-all btn-click mb-6">
            <Plus size={20} />
            New Chat
          </button>
          
          <div className="flex-1 overflow-y-auto space-y-2">
            <p className="px-2 text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">History</p>
            <div className="p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-xl text-accent-primary text-sm font-medium cursor-pointer">
              Current Session
            </div>
            {/* Mock History */}
            <div className="p-3 text-text-secondary text-sm hover:text-text-primary transition-colors cursor-pointer truncate">
              Grocery shopping list...
            </div>
            <div className="p-3 text-text-secondary text-sm hover:text-text-primary transition-colors cursor-pointer truncate">
              Work priorities for Mon...
            </div>
          </div>

          <div className="px-2 pt-4 border-t border-border-primary">
            <div className="flex items-center gap-3 p-2 bg-bg-card rounded-xl border border-border-primary">
              <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-bg-primary font-bold">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{userId}</p>
                <p className="text-[10px] text-text-muted">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col pt-16 relative">
        {/* Chat Header */}
        <header className="px-6 py-4 border-b border-border-primary flex items-center justify-between bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 lg:hidden text-text-secondary hover:text-text-primary"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                AI Task Assistant
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-green-500 uppercase tracking-widest font-black ml-1">Online</span>
              </h2>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-text-secondary hover:text-priority-high transition-colors uppercase tracking-widest"
          >
            <Trash2 size={14} />
            Clear Chat
          </button>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center fade-in">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-3xl flex items-center justify-center text-accent-primary mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">How can I help you today?</h3>
              <p className="text-text-secondary mb-12">Ask me to manage your tasks, set priorities, or just brainstorm ideas.</p>
              
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-4 bg-bg-surface border border-border-primary rounded-2xl text-sm text-text-secondary hover:text-text-primary hover:border-accent-primary transition-all text-left group"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-8">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-4 group",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  {/* Avatar */}
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all",
                    msg.role === "user" 
                      ? "bg-accent-primary border-accent-primary shadow-lg shadow-accent-primary/20" 
                      : "bg-bg-surface border-border-primary"
                  )}>
                    {msg.role === "user" ? <User size={20} className="text-bg-primary" /> : <Bot size={20} className="text-accent-primary" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn(
                    "relative flex flex-col max-w-[80%]",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user" 
                        ? "bg-accent-primary text-bg-primary font-medium" 
                        : "bg-bg-surface text-text-primary border-l-4 border-l-accent-primary"
                    )}>
                      {msg.content}
                    </div>

                    {/* Tool Calls */}
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {msg.toolCalls.map(tool => (
                          <span key={tool} className="flex items-center gap-1.5 px-3 py-1 bg-accent-primary text-bg-primary text-[10px] font-black uppercase tracking-wider rounded-full">
                            ✅ {tool.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className={cn(
                      "flex items-center gap-3 mt-2 text-[10px] font-black text-text-muted uppercase tracking-widest",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span>{msg.timestamp}</span>
                      {msg.role === "assistant" && (
                        <button 
                          onClick={() => copyToClipboard(msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-accent-primary"
                        >
                          <Copy size={12} />
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {loading && (
                <div className="flex gap-4 fade-in">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-bg-surface border border-border-primary flex items-center justify-center">
                    <Bot size={20} className="text-accent-primary" />
                  </div>
                  <div className="bg-bg-surface border-l-4 border-l-accent-primary px-6 py-4 rounded-3xl flex items-center gap-1.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent-primary/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2 bg-bg-surface border border-border-primary rounded-[32px] p-2 pl-6 focus-within:border-accent-primary transition-all shadow-xl">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Say 'add buy milk' or ask anything..."
                  className="flex-1 bg-transparent py-3 text-sm text-text-primary focus:outline-none placeholder:text-text-muted"
                />
                <button className="p-3 text-text-muted hover:text-accent-primary transition-colors btn-click">
                  <Mic size={20} />
                </button>
                <button 
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-3 bg-accent-primary text-bg-primary rounded-full btn-click disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] font-black text-text-muted uppercase tracking-widest mt-4">
              AI model: llama-3.3-70b-versatile
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
