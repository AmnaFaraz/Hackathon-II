"use client";

import Link from "next/link";
import { Check, Brain, BarChart3, ArrowRight, Zap, Target, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen py-10 md:py-0 overflow-hidden">
      {/* Background with Grid Pattern and Floats */}
      <div className="absolute inset-0 z-0 grid-pattern pointer-events-none" />
      
      {mounted && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
          <div className="absolute top-1/4 left-[10%] p-4 glass rounded-xl w-64 animate-float opacity-40 shadow-xl border-t border-[#00D4FF]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
              <div className="h-2 bg-text-secondary rounded w-3/4" />
            </div>
            <div className="h-2 bg-text-muted rounded w-1/2" />
          </div>
          
          <div className="absolute top-1/3 right-[15%] p-4 glass rounded-xl w-72 animate-float opacity-30 shadow-xl border-l-[3px] border-[#3FB950]" style={{ animationDelay: '1s', animationDuration: '7s' }}>
            <div className="flex items-center gap-2 mb-3">
              <Check className="text-[#3FB950] w-4 h-4" />
              <div className="h-2 bg-text-primary rounded w-2/3" />
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-bg-surface px-2 py-1 rounded">API Integration</span>
            </div>
          </div>
          
          <div className="absolute bottom-[20%] left-[20%] p-3 glass rounded-xl w-48 animate-float opacity-20 shadow-xl" style={{ animationDelay: '2.5s', animationDuration: '5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-glow flex items-center justify-center">
                <Brain className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="Space-y-1 w-full">
                <div className="h-1.5 bg-text-secondary rounded w-full mb-1" />
                <div className="h-1.5 bg-text-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 flex flex-col items-center max-w-4xl mx-auto fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm font-medium text-text-secondary mb-4 border border-accent-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            v2.0 Now Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-primary to-accent-primary pb-2">
            Your AI-Powered <br className="hidden md:block" /> Task Manager
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl">
            Stop forgetting. Start achieving. Let our AI assistant organize your life and skyrocket your productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-[#080B14] font-bold rounded-lg hover:shadow-[0_0_25px_var(--accent-glow)] transition-all btn-click"
            >
              Open Dashboard <ArrowRight size={20} />
            </Link>
            <Link 
              href="/chat" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-border-primary text-text-primary font-bold rounded-lg hover:border-accent-primary hover:text-accent-primary transition-all btn-click"
            >
              Chat with AI <Brain size={20} />
            </Link>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="mt-24 py-8 border-y border-border-primary slide-in-top glass rounded-2xl md:rounded-none md:border-x-0 md:bg-transparent md:backdrop-filter-none" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-border-primary">
            <div className="flex flex-col gap-1 items-center">
              <Brain className="text-accent-primary mb-2 w-6 h-6" />
              <span className="font-bold text-text-primary">AI-Powered</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <Zap className="text-accent-primary mb-2 w-6 h-6" />
              <span className="font-bold text-text-primary">Real-time Sync</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <Target className="text-accent-primary mb-2 w-6 h-6" />
              <span className="font-bold text-text-primary">Smart Prioritization</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <Search className="text-accent-primary mb-2 w-6 h-6" />
              <span className="font-bold text-text-primary">100% Free</span>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Everything you need to get things done</h2>
            <p className="text-text-secondary">Designed for professionals who need a powerful, organized workflow.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0D1117] dark:bg-[#0D1117] border border-border-primary p-8 rounded-2xl card-hover transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-glow rounded-full blur-3xl group-hover:bg-accent-primary/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mb-6 border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                <Check className="text-accent-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Smart Task Management</h3>
              <p className="text-text-secondary leading-relaxed">
                Add, edit, complete tasks with one click. Manage your workflow with priority levels, due dates, and custom tags.
              </p>
            </div>
            
            <div className="bg-[#0D1117] dark:bg-[#0D1117] border border-border-primary p-8 rounded-2xl card-hover transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-glow rounded-full blur-3xl group-hover:bg-accent-primary/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mb-6 border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                <Brain className="text-accent-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">AI Chat Assistant</h3>
              <p className="text-text-secondary leading-relaxed">
                Talk to your AI assistant. Just say <i>"add buy groceries tomorrow high priority"</i> and it's organized instantly.
              </p>
            </div>
            
            <div className="bg-[#0D1117] dark:bg-[#0D1117] border border-border-primary p-8 rounded-2xl card-hover transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-glow rounded-full blur-3xl group-hover:bg-accent-primary/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-accent-glow flex items-center justify-center mb-6 border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                <BarChart3 className="text-accent-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Progress Tracking</h3>
              <p className="text-text-secondary leading-relaxed">
                Visual stats, completion rates, and productivity insights at a glance to keep you on track.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-32 border-t border-border-primary pt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-text-secondary">Three simple steps to ultimate productivity.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start justify-between relative before:hidden md:before:block before:absolute before:top-8 before:left-12 before:right-12 before:h-0.5 before:bg-border-primary before:-z-10">
            {[
              { num: "1", title: "Create tasks manually or tell the AI", desc: "Use the dashboard or just type what you need to do in the chat." },
              { num: "2", title: "AI categorizes and prioritizes", desc: "Our system automatically extracts due dates and priority levels contextually." },
              { num: "3", title: "Track progress & stay productive", desc: "Review your stats, complete tasks, and enjoy the confetti." }
            ].map((step, idx) => (
              <div key={idx} className="flex-1 text-center group cursor-default">
                <div className="w-16 h-16 mx-auto bg-bg-surface border-2 border-border-primary rounded-full flex items-center justify-center text-2xl font-black text-text-muted group-hover:text-accent-primary group-hover:border-accent-primary group-hover:scale-110 transition-all duration-300 mb-6 drop-shadow-md z-10 relative">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="mt-32 mb-10 text-center glass border border-accent-primary/20 p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-primary/5" />
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 relative z-10">Ready to get things done?</h2>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-[#080B14] font-bold rounded-lg hover:shadow-[0_0_30px_var(--accent-glow)] transition-all btn-click relative z-10 group"
          >
            Go to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
        
      </div>
    </div>
  );
}
