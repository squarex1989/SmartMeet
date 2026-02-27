"use client";

import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { topics } from "@/data/topics";
import { reviewItems } from "@/data/review-items";
import type { TopicType, TopicId } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { NewTopicDialog } from "./NewTopicDialog";

const SECTION_CONFIG: { type: TopicType; label: string }[] = [
  { type: "client", label: "CLIENTS" },
  { type: "project", label: "PROJECTS" },
  { type: "goal", label: "GOALS" },
];

function usePendingCounts() {
  const reviewItemStatuses = useAppStore((s) => s.reviewItemStatuses);
  const getStatus = (item: (typeof reviewItems)[0]) =>
    (reviewItemStatuses[item.id] as string) ?? item.status;

  const byTopic = (topicId: TopicId) =>
    reviewItems.filter((r) => r.topicId === topicId && getStatus(r) === "pending_review").length;

  const total = reviewItems.filter((r) => getStatus(r) === "pending_review").length;

  return { byTopic, total };
}

export function TopicNavigator() {
  const currentContext = useAppStore((s) => s.currentContext);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const [sectionCollapsed, setSectionCollapsed] = useState<Record<TopicType, boolean>>({
    client: false,
    project: false,
    goal: false,
  });
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  const { byTopic, total } = usePendingCounts();

  const selectContext = (ctx: "all" | TopicId) => {
    setCurrentContext(ctx);
    setMobileSidebarOpen(false);
  };

  const toggleSection = (type: TopicType) => {
    setSectionCollapsed((c) => ({ ...c, [type]: !c[type] }));
  };

  const getTopicsByType = (type: TopicType) =>
    topics.filter((t) => t.type === type);

  return (
    <aside className="w-56 h-full border-r border-border bg-surface-2/50 flex flex-col shrink-0">
      <div className="py-3 px-3">
        <button
          type="button"
          onClick={() => selectContext("all")}
          className={cn(
            "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors",
            currentContext === "all"
              ? "bg-accent/10 text-accent"
              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="flex-1">General</span>
          {total > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted-foreground/15 px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground">
              {total}
            </span>
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-1 px-3">
        {SECTION_CONFIG.map(({ type, label }) => {
          const items = getTopicsByType(type);
          const isCollapsed = sectionCollapsed[type];
          return (
            <div key={type} className="mb-3">
              <button
                type="button"
                onClick={() => toggleSection(type)}
                className="flex items-center w-full px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                {label}
              </button>
              {!isCollapsed &&
                items.map((topic) => {
                  const isActive = currentContext === topic.id;
                  const pending = byTopic(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => selectContext(topic.id)}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      )}
                    >
                      <span className="text-base shrink-0" aria-hidden>
                        {topic.icon}
                      </span>
                      <span className="flex-1 truncate">{topic.name}</span>
                      {pending > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/12 px-1.5 text-[10px] font-medium tabular-nums text-accent">
                          {pending}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t border-border">
        <button
          type="button"
          onClick={() => setNewTopicOpen(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Topic
        </button>
      </div>
      <NewTopicDialog open={newTopicOpen} onClose={() => setNewTopicOpen(false)} />
    </aside>
  );
}
