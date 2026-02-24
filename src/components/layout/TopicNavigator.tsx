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
  const [collapsed, setCollapsed] = useState<Record<TopicType, boolean>>({
    client: false,
    project: false,
    goal: false,
  });
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  const { byTopic, total } = usePendingCounts();

  const toggleSection = (type: TopicType) => {
    setCollapsed((c) => ({ ...c, [type]: !c[type] }));
  };

  const getTopicsByType = (type: TopicType) =>
    topics.filter((t) => t.type === type);

  return (
    <aside className="w-56 h-full border-r border-border bg-background flex flex-col shrink-0">
      <div className="flex flex-col py-2 px-2">
        <button
          type="button"
          onClick={() => setCurrentContext("all")}
          className={cn(
            "interactive-subtle flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-left",
            currentContext === "all"
              ? "bg-accent/10 text-accent"
              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="flex-1">All Work</span>
          {total > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted-foreground/20 px-1.5 text-xs font-medium tabular-nums text-muted-foreground">
              {total}
            </span>
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {SECTION_CONFIG.map(({ type, label }) => {
          const items = getTopicsByType(type);
          const isCollapsed = collapsed[type];
          return (
            <div key={type} className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection(type)}
                className="interactive-subtle flex items-center w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
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
                      onClick={() => setCurrentContext(topic.id)}
                      className={cn(
                        "interactive-subtle flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-left",
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
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/15 px-1.5 text-[10px] font-medium tabular-nums text-accent">
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
      <div className="px-2 py-2 border-t border-border">
        <button
          type="button"
          onClick={() => setNewTopicOpen(true)}
          className="interactive-subtle flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          New Topic
        </button>
      </div>
      <NewTopicDialog open={newTopicOpen} onClose={() => setNewTopicOpen(false)} />
    </aside>
  );
}
