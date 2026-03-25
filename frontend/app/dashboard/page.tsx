"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, CheckSquare, MessageSquare, LogOut } from "lucide-react";
import { Task, api } from "@/lib/api";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { FilterBar } from "@/components/FilterBar";

type FilterStatus = "all" | "pending" | "completed";
type SortBy = "created" | "priority" | "due" | "title";

function TaskSkeleton() {
  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-3">
        <div className="skeleton w-5 h-5 rounded mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [userId, setUserId] = useState("demo-user");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<FilterStatus>("all");
  const [sort, setSort] = useState<SortBy>("created");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("userId");
    if (stored) setUserId(stored);
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { status, sort };
      if (search) params.search = search;
      const data = await api.tasks.list(userId, params);
      setTasks(data);
    } catch {
      // silently fail — backend may not be running locally
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [userId, status, sort, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keyboard shortcut: N = new task
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setShowModal(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleUpdate = (updated: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const handleDelete = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleCreated = (task: Task) => setTasks((prev) => [task, ...prev]);

  const pending = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <CheckSquare size={20} style={{ color: "var(--accent)" }} />
          <span className="font-bold text-[var(--text-primary)]">Panaversity TODO</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)]">{userId}</span>
          <Link href="/chat" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors" title="AI Chat">
            <MessageSquare size={18} />
          </Link>
          <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--urgent)] transition-colors" title="Sign out">
            <LogOut size={18} />
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", value: tasks.length },
            { label: "Pending", value: pending },
            { label: "Completed", value: completed },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border p-4 text-center"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {s.value}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header + Add button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">My Tasks</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all accent-glow"
            style={{ background: "var(--accent)", color: "#080B14" }}
            title="New task (N)"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mb-5">
          <FilterBar
            status={status}
            sort={sort}
            search={search}
            onStatusChange={setStatus}
            onSortChange={setSort}
            onSearchChange={setSearch}
          />
        </div>

        {/* Task List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <TaskSkeleton key={i} />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckSquare size={40} className="mb-4" style={{ color: "var(--border)" }} />
            <p className="text-[var(--text-secondary)] text-sm">
              {search ? "No tasks match your search." : "No tasks yet. Press N to add one!"}
            </p>
            {!search && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 rounded-lg text-sm"
                style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
              >
                Add your first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userId={userId}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          userId={userId}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
