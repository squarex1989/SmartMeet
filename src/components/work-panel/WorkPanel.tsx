"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { reviewItems } from "@/data/review-items";
import { getInsightsForContext } from "@/data/insights";
import type { InsightSeverity } from "@/data/insights";
import { ReviewCard } from "./ReviewCard";
import { SignalCard } from "./SignalCard";
import { ActiveRulesSection } from "./ActiveRulesSection";

const severityOrder: Record<InsightSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

function CollapsibleSection({
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
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="interactive-subtle flex w-full items-center gap-2 py-3 text-left text-sm font-medium"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span>{title}</span>
        {count > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        )}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function WorkPanel() {
  const currentContext = useAppStore((s) => s.currentContext);
  const setCommandRoomOverlay = useAppStore((s) => s.setCommandRoomOverlay);
  const reviewItemStatuses = useAppStore((s) => s.reviewItemStatuses);

  const getStatus = (item: (typeof reviewItems)[0]) =>
    (reviewItemStatuses[item.id] as string) ?? item.status;

  const pendingItems = reviewItems.filter((item) => {
    const status = getStatus(item);
    if (status !== "pending_review") return false;
    if (currentContext === "all") return true;
    return item.topicId === currentContext;
  });

  const contextInsights = getInsightsForContext(currentContext);
  const sortedInsights = [...contextInsights].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
  const topSignals = sortedInsights.slice(0, 3);

  const doneCount = reviewItems.filter((item) => {
    const status = getStatus(item);
    if (status !== "done") return false;
    if (currentContext === "all") return true;
    return item.topicId === currentContext;
  }).length;

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-background overflow-y-auto">
      <div className="flex-1 space-y-0 px-4 pt-2">
        <CollapsibleSection title="Pending Review" count={pendingItems.length}>
          <div className="space-y-2">
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
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Signals" count={contextInsights.length}>
          <div className="space-y-2">
            {topSignals.map((insight) => (
              <SignalCard
                key={insight.id}
                insight={insight}
                showTopic={currentContext === "all"}
              />
            ))}
            {contextInsights.length > 3 && (
              <button
                type="button"
                onClick={() => setCommandRoomOverlay("insights")}
                className="interactive-base text-xs text-muted-foreground hover:text-accent hover:underline"
              >
                View all insights →
              </button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Active Rules" count={0} defaultOpen={false}>
          <ActiveRulesSection />
        </CollapsibleSection>
      </div>

      {doneCount > 0 && (
        <div className="shrink-0 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => setCommandRoomOverlay("insights")}
            className="interactive-base text-xs text-muted-foreground hover:text-accent"
          >
            已完成 {doneCount} 项 · 查看历史 →
          </button>
        </div>
      )}
    </div>
  );
}
