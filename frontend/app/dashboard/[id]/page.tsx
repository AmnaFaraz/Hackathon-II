import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav
        className="flex items-center gap-3 px-6 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft size={18} />
        </Link>
        <span className="font-semibold text-[var(--text-primary)]">Task #{id}</span>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-[var(--text-secondary)] text-sm">
          Task detail view — full edit form coming in Phase II.
        </p>
      </main>
    </div>
  );
}
