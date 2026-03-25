"use client";

import { Search } from "lucide-react";

type FilterStatus = "all" | "pending" | "completed";
type SortBy = "created" | "priority" | "due" | "title";

interface FilterBarProps {
  status: FilterStatus;
  sort: SortBy;
  search: string;
  onStatusChange: (s: FilterStatus) => void;
  onSortChange: (s: SortBy) => void;
  onSearchChange: (s: string) => void;
}

const STATUS_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Created", value: "created" },
  { label: "Priority", value: "priority" },
  { label: "Due Date", value: "due" },
  { label: "Title", value: "title" },
];

export function FilterBar({
  status,
  sort,
  search,
  onStatusChange,
  onSortChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Status Tabs */}
      <div
        className="flex rounded-lg p-1 gap-1"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: status === tab.value ? "var(--accent)" : "transparent",
              color: status === tab.value ? "#080B14" : "var(--text-secondary)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortBy)}
        className="px-3 py-2 rounded-lg text-sm outline-none"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="flex-1 relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>
    </div>
  );
}
