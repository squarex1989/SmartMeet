"use client";

import { useState } from "react";
import { Home, Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover/tip:flex">
        <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-lg">
          {label}
        </div>
      </div>
    </div>
  );
}

export function TopicNavigator() {
  const currentContext = useAppStore((s) => s.currentContext);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed);
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

  if (sidebarCollapsed) {
    return (
      <aside className="w-12 h-full border-r border-border bg-background flex flex-col shrink-0 transition-all duration-200">
        <div className="flex flex-col items-center py-2 gap-1">
          <Tooltip label="All Work">
            <button
              type="button"
              onClick={() => selectContext("all")}
              className={cn(
                "relative interactive-subtle flex items-center justify-center w-8 h-8 rounded-md",
                currentContext === "all"
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <Home className="h-4 w-4" />
              {total > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-accent" />
              )}
            </button>
          </Tooltip>
        </div>

        <nav className="flex-1 overflow-y-auto flex flex-col items-center gap-1 py-2">
          {SECTION_CONFIG.map(({ type }) => {
            const items = getTopicsByType(type);
            return items.map((topic) => {
              const isActive = currentContext === topic.id;
              const pending = byTopic(topic.id);
              return (
                <Tooltip key={topic.id} label={topic.name}>
                  <button
                    type="button"
                    onClick={() => selectContext(topic.id)}
                    className={cn(
                      "relative interactive-subtle flex items-center justify-center w-8 h-8 rounded-md text-base",
                      isActive
                        ? "bg-accent/10"
                        : "hover:bg-surface-2"
                    )}
                  >
                    <span aria-hidden>{topic.icon}</span>
                    {pending > 0 && (
                      <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-accent" />
                    )}
                  </button>
                </Tooltip>
              );
            });
          })}
        </nav>

        <div className="flex flex-col items-center gap-1 py-2 border-t border-border">
          <Tooltip label="New Topic">
            <button
              type="button"
              onClick={() => setNewTopicOpen(true)}
              className="interactive-subtle flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label="Expand sidebar">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="interactive-subtle flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
        <NewTopicDialog open={newTopicOpen} onClose={() => setNewTopicOpen(false)} />
      </aside>
    );
  }

  return (
    <aside className="w-56 h-full border-r border-border bg-background flex flex-col shrink-0 transition-all duration-200">
      <div className="flex items-center justify-between py-2 px-2">
        <button
          type="button"
          onClick={() => selectContext("all")}
          className={cn(
            "interactive-subtle flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-left flex-1",
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
        <button
          type="button"
          onClick={() => setSidebarCollapsed(true)}
          className="interactive-subtle flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground ml-1 shrink-0"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {SECTION_CONFIG.map(({ type, label }) => {
          const items = getTopicsByType(type);
          const isCollapsed = sectionCollapsed[type];
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
                      onClick={() => selectContext(topic.id)}
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
