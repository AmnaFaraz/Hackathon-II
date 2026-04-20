import React from "react";
import Link from "next/link";
import { Zap, MessageSquare, LineChart, Sparkles, Layout, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-bg-primary overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />
        
        {/* Floating Animated Cards (Simulated with div elements) */}
        <div className="absolute top-1/4 -right-20 w-64 h-24 glass rounded-2xl animate-float opacity-20 hidden lg:block" style={{ animationDelay: '0s' }}>
          <div className="p-4 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-priority-high" />
            <div className="space-y-2 flex-1">
              <div className="h-2 w-3/4 bg-border-primary rounded" />
              <div className="h-2 w-1/2 bg-border-primary rounded" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-1/4 -left-20 w-72 h-24 glass rounded-2xl animate-float opacity-20 hidden lg:block" style={{ animationDelay: '2s' }}>
          <div className="p-4 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-priority-low" />
            <div className="space-y-2 flex-1">
              <div className="h-2 w-2/3 bg-border-primary rounded" />
              <div className="h-2 w-1/3 bg-border-primary rounded" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">AI-Powered productivity</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-text-primary leading-[1.1]">
            Your AI-Powered <br />
            <span className="text-accent-primary">Task Manager</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto">
            Stop forgetting. Start achieving. Let AI organize your life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-10 py-5 bg-accent-primary text-bg-primary text-lg font-bold rounded-2xl btn-click shadow-lg shadow-accent-primary/20"
            >
              Open Dashboard
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto px-10 py-5 border-2 border-border-primary bg-bg-surface text-text-primary text-lg font-bold rounded-2xl btn-click hover:border-accent-primary transition-colors"
            >
              Chat with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto px-6 mb-32">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-8 px-12 glass rounded-3xl text-sm font-bold uppercase tracking-widest text-text-secondary">
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI-Powered</span>
          <span className="flex items-center gap-2"><Layout className="w-4 h-4" /> Real-time Sync</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Smart Prioritization</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 100% Free</span>
        </div>
      </div>

      {/* Features Section */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Everything you need</h2>
            <p className="text-text-secondary max-w-lg mx-auto">Our features are designed to keep you focused and organized with minimal effort.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layout className="w-8 h-8 text-accent-primary" />}
              title="Smart Task Management"
              desc="Add, edit, complete tasks with one click. Priority levels, due dates, tags."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8 text-accent-primary" />}
              title="AI Chat Assistant"
              desc="Talk to your AI assistant. Say 'add buy groceries' and it's done instantly."
            />
            <FeatureCard 
              icon={<LineChart className="w-8 h-8 text-accent-primary" />}
              title="Progress Tracking"
              desc="Visual stats, completion rates, productivity insights at a glance."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-bg-surface py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Three easy steps</h2>
            <p className="text-text-secondary max-w-lg mx-auto">Getting started is as easy as talking to a friend.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <StepItem 
              num="01"
              title="Create tasks"
              desc="Create tasks manually or just tell the AI what's on your mind."
            />
            <StepItem 
              num="02"
              title="AI Organizes"
              desc="AI categorizes and prioritizes your tasks automatically based on context."
            />
            <StepItem 
              num="03"
              title="Crush your goals"
              desc="Track progress with visual insights and stay productive all day long."
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">Ready to get things done?</h2>
        <Link
          href="/dashboard"
          className="inline-block px-12 py-5 bg-accent-primary text-bg-primary text-xl font-bold rounded-2xl btn-click shadow-lg shadow-accent-primary/20"
        >
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-bg-card rounded-3xl border border-border-primary card-hover group cursor-default">
      <div className="mb-6 p-4 bg-bg-surface rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-4">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="relative">
      <div className="text-8xl font-black text-border-primary/30 absolute -top-12 -left-4 pointer-events-none select-none">
        {num}
      </div>
      <div className="relative pt-4">
        <h3 className="text-2xl font-bold text-text-primary mb-4">{title}</h3>
        <p className="text-text-secondary leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
