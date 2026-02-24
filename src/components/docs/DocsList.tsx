"use client";

import { documentsMeta, getDocumentContent } from "@/data/documents";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { DocumentMeta } from "@/data/documents";

const TYPE_COLORS: Record<string, string> = {
  notes: "bg-blue-100 text-blue-800",
  report: "bg-amber-100 text-amber-800",
  slides: "bg-purple-100 text-purple-800",
  proposal: "bg-emerald-100 text-emerald-800",
  agenda: "bg-slate-100 text-slate-800",
  strategy: "bg-rose-100 text-rose-800",
};

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffM < 1) return "just now";
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

export function DocsList() {
  const docSearchQuery = useAppStore((s) => s.docSearchQuery);
  const docTypeFilter = useAppStore((s) => s.docTypeFilter);
  const docTopicFilter = useAppStore((s) => s.docTopicFilter);
  const setOpenDocumentId = useAppStore((s) => s.setOpenDocumentId);

  const typeMap: Record<string, string> = {
    notes: "notes",
    reports: "report",
    slides: "slides",
    proposals: "proposal",
    agenda: "agenda",
    strategy: "strategy",
  };
  const mappedType = docTypeFilter === "all" ? "all" : typeMap[docTypeFilter] ?? docTypeFilter;

  const filtered = documentsMeta
    .filter((doc) => {
      if (
        docSearchQuery &&
        !doc.title.toLowerCase().includes(docSearchQuery.toLowerCase())
      )
        return false;
      if (mappedType !== "all" && mappedType !== doc.type) return false;
      if (
        docTopicFilter.length > 0 &&
        !docTopicFilter.includes(doc.topicId)
      )
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return (
    <div className="p-6">
      <div className="grid gap-3">
        {filtered.map((doc) => (
          <DocCard key={doc.id} doc={doc} onSelect={() => setOpenDocumentId(doc.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No documents match your filters.
        </p>
      )}
    </div>
  );
}

function DocCard({
  doc,
  onSelect,
}: {
  doc: DocumentMeta;
  onSelect: () => void;
}) {
  const content = getDocumentContent(doc.id);
  const summary = content?.body?.slice(0, 80).replace(/\n/g, " ") ?? "";
  const topic = getTopicById(doc.topicId);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="interactive-subtle w-full text-left p-4 rounded-lg border border-border bg-surface-1 hover:bg-surface-2 hover:border-accent/20"
    >
      <div className="font-semibold text-foreground mb-2">{doc.title}</div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full capitalize",
            TYPE_COLORS[doc.type] ?? "bg-gray-100 text-gray-800"
          )}
        >
          {doc.type}
        </span>
        {topic && (
          <span className="text-xs text-muted-foreground">{topic.name}</span>
        )}
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(doc.updatedAt)}
        </span>
      </div>
      {summary && (
        <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
      )}
    </button>
  );
}
