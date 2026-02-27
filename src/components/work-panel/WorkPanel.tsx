"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { reviewItems } from "@/data/review-items";
import { getTodosForContext } from "@/data/todo-items";
import { getDecisionsForContext } from "@/data/decision-items";
import { ReviewCard } from "./ReviewCard";
import { TodoCard } from "./TodoCard";
import { DecisionCard } from "./DecisionCard";
import { ActiveRulesSection, usePlaybookCount } from "./ActiveRulesSection";

function Section({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-3 text-left text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span>{title}</span>
        {count > 0 && (
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {count}
          </span>
        )}
      </button>
      {open && <div className="pb-3 space-y-2">{children}</div>}
    </div>
  );
}

export function WorkPanel() {
  const currentContext = useAppStore((s) => s.currentContext);
  const reviewItemStatuses = useAppStore((s) => s.reviewItemStatuses);

  const getStatus = (item: (typeof reviewItems)[0]) =>
    (reviewItemStatuses[item.id] as string) ?? item.status;

  const pendingItems = reviewItems.filter((item) => {
    const status = getStatus(item);
    if (status !== "pending_review") return false;
    if (currentContext === "all") return true;
    return item.topicId === currentContext;
  });

  const todoItems = getTodosForContext(currentContext);
  const decisionItems = getDecisionsForContext(currentContext);
  const playbookCount = usePlaybookCount();

  const attentionCount = decisionItems.length;

  const doneCount = reviewItems.filter((item) => {
    const status = getStatus(item);
    if (status !== "done") return false;
    if (currentContext === "all") return true;
    return item.topicId === currentContext;
  }).length;

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-background overflow-y-auto">
      <div className="flex-1 px-5 pt-3">
        <Section title="Prepared for you" count={pendingItems.length}>
          {pendingItems.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">All clear — nothing to review.</p>
          ) : (
            pendingItems.map((item) => (
              <ReviewCard
                key={item.id}
                item={item}
                showTopic={currentContext === "all"}
              />
            ))
          )}
        </Section>

        <Section title="Your follow-ups" count={todoItems.length}>
          {todoItems.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No follow-ups right now.</p>
          ) : (
            todoItems.map((item) => (
              <TodoCard
                key={item.id}
                item={item}
                showTopic={currentContext === "all"}
              />
            ))
          )}
        </Section>

        <Section title="Need your attention" count={attentionCount}>
          {attentionCount === 0 ? (
            <p className="text-xs text-muted-foreground py-2">Nothing needs attention right now.</p>
          ) : (
            decisionItems.map((item) => (
              <DecisionCard
                key={item.id}
                item={item}
                showTopic={currentContext === "all"}
              />
            ))
          )}
        </Section>

        <Section title="Active Playbook" count={playbookCount} defaultOpen={false}>
          <ActiveRulesSection />
        </Section>
      </div>

      {doneCount > 0 && (
        <div className="shrink-0 border-t border-border px-5 py-3">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            已完成 {doneCount} 项 · 查看历史 →
          </button>
        </div>
      )}
    </div>
  );
}
