"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, Tag, Calendar, MoreVertical } from "lucide-react";
import { Task, api } from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  userId: string;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, userId, onUpdate, onDelete }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const updated = await api.tasks.toggleComplete(userId, task.id);
      if (!task.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }
      onUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.tasks.delete(userId, task.id);
      onDelete(task.id);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  const priorityColors = {
    urgent: "bg-priority-high",
    high: "bg-priority-high",
    medium: "bg-priority-medium",
    low: "bg-priority-low",
  };

  const priorityLabels = {
    urgent: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
  };

  return (
    <div
      className={cn(
        "group relative bg-bg-surface border border-border-primary rounded-2xl p-6 transition-all card-hover overflow-hidden",
        task.completed && "opacity-50 grayscale-[0.5]",
        isDeleting && "slide-out-left"
      )}
    >
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-50">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 rounded-full bg-accent-primary animate-confetti"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Left Priority Border */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", priorityColors[task.priority])} />

      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={cn(
              "text-lg font-bold text-text-primary transition-all",
              task.completed && "line-through text-text-muted"
            )}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded text-bg-primary uppercase tracking-wider",
                priorityColors[task.priority]
              )}>
                {priorityLabels[task.priority]}
              </span>
              {task.due_date && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-2 py-0.5 bg-bg-card rounded border border-border-primary">
                  <Calendar size={10} />
                  {format(new Date(task.due_date), "MMM d")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggle}
              className={cn(
                "p-2 rounded-lg transition-colors btn-click",
                task.completed ? "text-accent-primary bg-accent-primary/10" : "text-text-secondary hover:bg-border-primary"
              )}
              title="Toggle Complete"
            >
              <Check size={16} />
            </button>
            <button
              className="p-2 text-text-secondary rounded-lg hover:bg-border-primary transition-colors btn-click"
              title="Edit Task"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-priority-high/60 hover:text-priority-high rounded-lg hover:bg-priority-high/10 transition-colors btn-click"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className={cn(
          "text-sm text-text-secondary mb-6 line-clamp-2 leading-relaxed flex-1",
          task.completed && "text-text-muted"
        )}>
          {task.description || "No description provided."}
        </p>

        <div className="flex flex-wrap gap-2">
          {task.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-bg-card border border-border-primary px-2.5 py-1 rounded-lg">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
