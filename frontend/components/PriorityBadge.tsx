import { PRIORITY_LABELS } from "@/lib/utils";

type Priority = "low" | "medium" | "high" | "urgent";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`badge-${priority} inline-flex items-center px-2 py-0.5 rounded text-xs font-medium`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
