"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Filter, SortAsc, LayoutGrid, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Task, api } from "@/lib/api";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "active" | "completed" | "high" | "today";
type SortBy = "date" | "priority" | "title";

export default function DashboardPage() {
  const [userId, setUserId] = useState("demo-user");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("userId");
    if (stored) setUserId(stored);
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Mapping internal filter to API status if needed, but the spec asks for specific filters
      const data = await api.tasks.list(userId);
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keyboard shortcut: N = new task, Esc = close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setShowModal(true);
      }
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleUpdate = (updated: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const handleDelete = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setShowModal(false);
  };

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtering & Sorting logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         (t.description?.toLowerCase().includes(search.toLowerCase()) || false);
    
    if (!matchesSearch) return false;

    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    if (filter === "high") return t.priority === "high" || t.priority === "urgent";
    if (filter === "today") {
      if (!t.due_date) return false;
      const today = new Date().toISOString().split('T')[0];
      return t.due_date.startsWith(today);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "priority") {
      const pMap = { urgent: 3, high: 2, medium: 1, low: 0 };
      return pMap[b.priority] - pMap[a.priority];
    }
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={totalTasks} icon={<LayoutGrid size={20} />} />
          <StatCard 
            label="Completed" 
            value={completedTasks} 
            sub={`(${completionRate}%)`} 
            icon={<CheckCircle2 size={20} />} 
          />
          <StatCard label="Pending" value={pendingTasks} icon={<Clock size={20} />} />
          <StatCard label="High Priority" value={highPriorityTasks} icon={<AlertCircle size={20} />} />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
            <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>Active</FilterButton>
            <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")}>Completed</FilterButton>
            <FilterButton active={filter === "high"} onClick={() => setFilter("high")}>High Priority</FilterButton>
            <FilterButton active={filter === "today"} onClick={() => setFilter("today")}>Due Today</FilterButton>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-primary rounded-xl text-sm focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="appearance-none pl-10 pr-8 py-2 bg-bg-surface border border-border-primary rounded-xl text-sm focus:outline-none focus:border-accent-primary transition-colors cursor-pointer"
              >
                <option value="date">Sort By: Date</option>
                <option value="priority">Sort By: Priority</option>
                <option value="title">Sort By: Title</option>
              </select>
              <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
            </div>

            {/* New Task Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-bg-primary font-bold rounded-xl text-sm btn-click"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <TaskSkeleton key={i} />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} isSearch={!!search} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
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

      {/* New Task Modal */}
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

function StatCard({ label, value, sub, icon }: { label: string, value: number, sub?: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-bg-surface border border-border-primary rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-bg-card rounded-lg border border-border-primary text-text-secondary">
          {icon}
        </div>
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-accent-primary">{value}</span>
        {sub && <span className="text-sm font-medium text-text-secondary">{sub}</span>}
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-accent-primary text-bg-primary" 
          : "bg-bg-surface text-text-secondary border border-border-primary hover:border-accent-primary hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}

function TaskSkeleton() {
  return (
    <div className="h-44 bg-bg-surface border border-border-primary rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 w-32 bg-bg-card rounded-md" />
        <div className="h-6 w-16 bg-bg-card rounded-md" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-bg-card rounded-md" />
        <div className="h-4 w-3/4 bg-bg-card rounded-md" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-12 bg-bg-card rounded-full" />
        <div className="h-6 w-12 bg-bg-card rounded-full" />
      </div>
    </div>
  );
}

function EmptyState({ onAdd, isSearch }: { onAdd: () => void, isSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
      {/* CSS Illustration */}
      <div className="relative w-32 h-32 mb-8 bg-bg-surface rounded-full flex items-center justify-center border-4 border-dashed border-border-primary">
         <LayoutGrid className="text-border-primary" size={48} />
         <div className="absolute top-0 right-0 w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-bg-primary">
           <Plus size={16} />
         </div>
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-2">
        {isSearch ? "No tasks found" : "No tasks yet"}
      </h3>
      <p className="text-text-secondary mb-8 max-w-sm">
        {isSearch ? "Try adjusting your search or filters to find what you're looking for." : "Start your journey by creating your first task. Press N to get started instantly."}
      </p>
      {!isSearch && (
        <button
          onClick={onAdd}
          className="px-8 py-3 bg-accent-primary text-bg-primary font-bold rounded-xl btn-click"
        >
          Create First Task
        </button>
      )}
    </div>
  );
}
