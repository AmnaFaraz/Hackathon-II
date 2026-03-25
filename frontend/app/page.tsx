import Link from "next/link";
import { CheckSquare, Zap, Bot, Cloud } from "lucide-react";

const PHASES = [
  { icon: "🖥️", title: "Phase I", desc: "Python Console App", points: "100 pts" },
  { icon: "🌐", title: "Phase II", desc: "Full-Stack Web App", points: "150 pts" },
  { icon: "🤖", title: "Phase III", desc: "AI Chatbot", points: "200 pts" },
  { icon: "☸️", title: "Phase IV", desc: "Kubernetes", points: "250 pts" },
  { icon: "☁️", title: "Phase V", desc: "Kafka + Dapr + Cloud", points: "300 pts" },
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <CheckSquare size={20} style={{ color: "var(--accent)" }} />
          <span className="font-bold text-[var(--text-primary)]">Panaversity TODO</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm px-4 py-1.5 rounded-lg font-medium transition-all"
            style={{ background: "var(--accent)", color: "#080B14" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
          style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "var(--accent)" }}
        >
          <Zap size={12} />
          Hackathon II — 1000+ pts
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Evolution of{" "}
          <span style={{ color: "var(--accent)" }}>TODO</span>
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-xl mb-8">
          From a simple Python console app to a full cloud-native system with AI,
          Kubernetes, and real-time event streaming.
        </p>

        <div className="flex gap-4">
          <Link
            href="/sign-up"
            className="px-6 py-3 rounded-lg font-medium transition-all accent-glow"
            style={{ background: "var(--accent)", color: "#080B14" }}
          >
            Start Managing Tasks
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg font-medium transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            Demo Dashboard →
          </Link>
        </div>
      </section>

      {/* Phases */}
      <section className="px-6 pb-20 max-w-4xl mx-auto w-full">
        <h2 className="text-center text-xl font-semibold text-[var(--text-primary)] mb-8">
          5 Phases of Evolution
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {PHASES.map((phase) => (
            <div
              key={phase.title}
              className="flex flex-col items-center p-4 rounded-xl border text-center"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-2xl mb-2">{phase.icon}</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{phase.title}</span>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5">{phase.desc}</span>
              <span
                className="text-xs mt-2 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,212,255,0.1)", color: "var(--accent)" }}
              >
                {phase.points}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        className="border-t px-6 py-16"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
          {[
            { icon: <CheckSquare size={24} />, title: "Smart Task Management", desc: "Priority levels, tags, due dates, and instant search." },
            { icon: <Bot size={24} />, title: "AI Chatbot", desc: "Chat with Groq AI to add, update, and manage tasks via natural language." },
            { icon: <Cloud size={24} />, title: "Cloud Native", desc: "Kubernetes-ready with Kafka event streaming and Dapr service mesh." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <div style={{ color: "var(--accent)" }}>{f.icon}</div>
              <h3 className="font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
