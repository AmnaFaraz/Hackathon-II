"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, CheckSquare, ArrowLeft, Bot, User } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCalls?: string[];
}

export default function ChatPage() {
  const [userId, setUserId] = useState("demo-user");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI TODO assistant. I can help you add, update, complete, or delete tasks. What would you like to do?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userId");
    if (stored) setUserId(stored);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat.send(userId, text, conversationId);
      setConversationId(res.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.response, toolCalls: res.tool_calls },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect to the backend. Make sure the API is running." },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center gap-3 px-6 py-4 border-b"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft size={18} />
        </Link>
        <CheckSquare size={20} style={{ color: "var(--accent)" }} />
        <span className="font-bold text-[var(--text-primary)]">AI Chat</span>
        <span className="text-xs text-[var(--text-secondary)] ml-auto">{userId}</span>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: msg.role === "user" ? "var(--accent)" : "var(--surface-2)",
                }}
              >
                {msg.role === "user" ? (
                  <User size={14} color="#080B14" />
                ) : (
                  <Bot size={14} style={{ color: "var(--accent)" }} />
                )}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-xs sm:max-w-md ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "var(--accent)" : "var(--surface)",
                    color: msg.role === "user" ? "#080B14" : "var(--text-primary)",
                    border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  }}
                >
                  {msg.content}
                </div>

                {/* Tool call pills */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {msg.toolCalls.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(0,212,255,0.1)", color: "var(--accent)" }}
                      >
                        ✓ {tool.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--surface-2)" }}
              >
                <Bot size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div
                className="px-4 py-3 rounded-2xl flex gap-1 items-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="border-t px-4 py-4"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Ctrl+Enter to send)"
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              minHeight: "42px",
              maxHeight: "120px",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl transition-all flex-shrink-0"
            style={{
              background: loading || !input.trim() ? "var(--border)" : "var(--accent)",
              color: "#080B14",
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-xs text-[var(--text-secondary)] mt-2">
          Powered by Groq llama-3.3-70b-versatile
        </p>
      </div>
    </div>
  );
}
