"use client";

import { documentsMeta, getDocumentContent } from "@/data/documents";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { DocumentMeta } from "@/data/documents";

const TYPE_COLORS: Record<string, string> = {
  notes: "bg-orange-100 text-orange-700",
  report: "bg-stone-100 text-stone-700",
  slides: "bg-orange-100/70 text-orange-700",
  proposal: "bg-stone-100 text-stone-700",
  agenda: "bg-stone-100 text-stone-700",
  strategy: "bg-orange-100 text-orange-700",
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
    <div className="p-4 sm:p-6">
      <div className="grid gap-3">
        {filtered.map((doc) => (
          <DocCard key={doc.id} doc={doc} onSelect={() => setOpenDocumentId(doc.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-stone-500 py-8 text-center">
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
      className="w-full text-left p-4 bg-stone-50 shadow-sm border border-stone-200 rounded-2xl"
    >
      <div className="font-semibold text-stone-800 mb-2">{doc.title}</div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full capitalize",
            TYPE_COLORS[doc.type] ?? "bg-stone-100 text-stone-700"
          )}
        >
          {doc.type}
        </span>
        {topic && (
          <span className="text-xs text-stone-500">{topic.name}</span>
        )}
        <span className="text-xs text-stone-500">
          {formatRelativeTime(doc.updatedAt)}
        </span>
      </div>
      {summary && (
        <p className="text-sm text-stone-500 line-clamp-2">{summary}</p>
      )}
    </button>
  );
}
