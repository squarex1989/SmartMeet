"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { topics, type TopicId } from "@/data/topics";
import { DocsList } from "./DocsList";
import { DocEditor } from "./DocEditor";
import { cn } from "@/lib/utils";

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "notes", label: "Notes" },
  { value: "reports", label: "Reports" },
  { value: "slides", label: "Slides" },
  { value: "proposals", label: "Proposals" },
  { value: "agenda", label: "Agenda" },
  { value: "strategy", label: "Strategy" },
] as const;

function Sidebar() {
  const docSearchQuery = useAppStore((s) => s.docSearchQuery);
  const setDocSearchQuery = useAppStore((s) => s.setDocSearchQuery);
  const docTypeFilter = useAppStore((s) => s.docTypeFilter);
  const setDocTypeFilter = useAppStore((s) => s.setDocTypeFilter);
  const docTopicFilter = useAppStore((s) => s.docTopicFilter);
  const setDocTopicFilter = useAppStore((s) => s.setDocTopicFilter);

  const toggleTopic = (id: TopicId) => {
    if (docTopicFilter.includes(id)) {
      setDocTopicFilter(docTopicFilter.filter((t) => t !== id));
    } else {
      setDocTopicFilter([...docTopicFilter, id]);
    }
  };

  return (
    <>
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search docs..."
            value={docSearchQuery}
            onChange={(e) => setDocSearchQuery(e.target.value)}
            className="interactive-subtle w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-surface-1 focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>
      <div className="p-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Type</p>
        <div className="flex flex-wrap gap-1">
          {TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDocTypeFilter(value)}
              className={cn(
                "interactive-subtle px-2 py-1 text-xs rounded-md",
                docTypeFilter === value
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-3 flex-1 overflow-auto">
        <p className="text-xs font-medium text-muted-foreground mb-2">Topic</p>
        <div className="space-y-1.5">
          {topics.map((topic) => (
            <label
              key={topic.id}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={docTopicFilter.includes(topic.id)}
                onChange={() => toggleTopic(topic.id)}
                className="rounded border-border"
              />
              {topic.name}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

export function DocsView() {
  const openDocumentId = useAppStore((s) => s.openDocumentId);
  const setOpenDocumentId = useAppStore((s) => s.setOpenDocumentId);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 border-r border-border bg-background flex-col overflow-hidden">
        <Sidebar />
      </aside>

      {/* Desktop main */}
      <main className="hidden md:flex flex-1 min-w-0 overflow-auto bg-background">
        {openDocumentId === null ? <DocsList /> : <DocEditor />}
      </main>

      {/* Mobile: full-screen views */}
      <div className="flex md:hidden flex-1 min-w-0 flex-col bg-background overflow-hidden">
        {openDocumentId !== null ? (
          <>
            <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border">
              <button
                type="button"
                onClick={() => setOpenDocumentId(null)}
                className="interactive-base flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                返回文档
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <DocEditor />
            </div>
          </>
        ) : (
          <>
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-sm font-medium">Documents</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className={cn(
                  "interactive-base flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs",
                  mobileFiltersOpen
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                筛选
              </button>
            </div>
            {mobileFiltersOpen && (
              <div className="shrink-0 border-b border-border bg-surface-1 max-h-[50vh] overflow-auto flex flex-col">
                <Sidebar />
              </div>
            )}
            <div className="flex-1 overflow-auto">
              <DocsList />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
