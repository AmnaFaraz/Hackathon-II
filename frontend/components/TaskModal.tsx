"use client";

import { useState } from "react";
import { X, Plus, Calendar, Tag, AlertCircle } from "lucide-react";
import { api, TaskCreate } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  userId: string;
  onClose: () => void;
  onCreated: (task: import("@/lib/api").Task) => void;
}

const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export function TaskModal({ userId, onClose, onCreated }: TaskModalProps) {
  const [form, setForm] = useState<TaskCreate>({
    title: "",
    description: "",
    priority: "medium",
    tags: [],
    due_date: undefined,
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Process tags from comma separated input if needed, but here we use a list
      const task = await api.tasks.create(userId, form);
      onCreated(task);
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagInput(val);
    const tags = val.split(",").map(t => t.trim()).filter(t => t !== "");
    setForm(f => ({ ...f, tags }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-bg-surface border border-border-primary rounded-3xl p-8 shadow-2xl scale-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent-primary" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Create New Task</h2>
            <p className="text-text-secondary text-sm">Add a new task to your workspace</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-secondary hover:text-text-primary bg-bg-card rounded-xl border border-border-primary transition-colors btn-click"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Task Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What are you working on?"
              autoFocus
              className="w-full px-5 py-3 bg-bg-card border border-border-primary rounded-2xl text-text-primary focus:outline-none focus:border-accent-primary transition-all placeholder:text-text-muted"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Provide more context..."
              rows={3}
              className="w-full px-5 py-3 bg-bg-card border border-border-primary rounded-2xl text-text-primary focus:outline-none focus:border-accent-primary transition-all resize-none placeholder:text-text-muted"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Priority</label>
              <div className="relative">
                <select
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as any }))}
                  className="w-full appearance-none px-5 py-3 bg-bg-card border border-border-primary rounded-2xl text-text-primary focus:outline-none focus:border-accent-primary transition-all cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Priority</option>
                </select>
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.due_date?.split("T")[0] || ""}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                  className="w-full px-5 py-3 bg-bg-card border border-border-primary rounded-2xl text-text-primary focus:outline-none focus:border-accent-primary transition-all flex justify-between"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Tags (Comma separated)</label>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagsChange}
                placeholder="e.g. work, urgent, hobby"
                className="w-full pl-12 pr-5 py-3 bg-bg-card border border-border-primary rounded-2xl text-text-primary focus:outline-none focus:border-accent-primary transition-all placeholder:text-text-muted"
              />
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={18} />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-border-primary text-text-secondary font-bold rounded-2xl hover:bg-bg-card transition-colors btn-click"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-accent-primary text-bg-primary font-bold rounded-2xl btn-click shadow-lg shadow-accent-primary/20 disabled:opacity-50"
            >
              {loading ? "Creating task..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
