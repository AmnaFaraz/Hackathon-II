"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, Tag, Calendar } from "lucide-react";
import { Task, api } from "@/lib/api";
import { PriorityBadge } from "./PriorityBadge";
import { formatRelative } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  userId: string;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, userId, onUpdate, onDelete }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    setAnimating(true);
    try {
      const updated = await api.tasks.toggleComplete(userId, task.id);
      onUpdate(updated);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setLoading(true);
    try {
      await api.tasks.delete(userId, task.id);
      onDelete(task.id);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className="rounded-lg border p-4 transition-all hover:border-[var(--accent)] group"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        opacity: task.completed ? 0.6 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Complete toggle */}
        <button
          onClick={handleComplete}
          disabled={loading}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            animating ? "complete-pop" : ""
          }`}
          style={{
            borderColor: task.completed ? "var(--accent)" : "var(--border)",
            background: task.completed ? "var(--accent)" : "transparent",
          }}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && <Check size={12} color="#080B14" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-medium text-sm ${task.completed ? "line-through text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}`}
            >
              {task.title}
            </span>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={10} className="text-[var(--text-secondary)]" />
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <Calendar size={10} />
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
            <span className="text-xs text-[var(--text-secondary)] ml-auto">
              {formatRelative(task.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded transition-colors hover:bg-red-500/10"
            style={{ color: confirmDelete ? "var(--urgent)" : "var(--text-secondary)" }}
            title={confirmDelete ? "Click again to confirm" : "Delete task"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
