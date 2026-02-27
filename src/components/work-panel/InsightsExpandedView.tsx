"use client";

import { useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getInsightsForContext } from "@/data/insights";
import { getTopicById } from "@/data/topics";
import type { Insight, InsightSeverity } from "@/data/insights";
import { cn } from "@/lib/utils";

const severityOrder: InsightSeverity[] = ["critical", "warning", "info"];

const severityDot: Record<string, string> = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-400",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffM / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

function InsightCard({ insight }: { insight: Insight }) {
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setCommandRoomOverlay = useAppStore((s) => s.setCommandRoomOverlay);
  const setChatInputValue = useAppStore((s) => s.setChatInputValue);

  const dotColor = severityDot[insight.severity] ?? "bg-muted-foreground";
  const topic = insight.topicId ? getTopicById(insight.topicId) : null;

  const handleFollowUp = () => {
    if (!insight.followUpQuestion) return;
    setCurrentContext(insight.topicId ?? "all");
    setCommandRoomOverlay(null);
    setChatInputValue(insight.followUpQuestion);
  };

  return (
    <div className="rounded-xl bg-background px-3 py-2.5 hover:bg-surface-2 transition-colors">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full",
            dotColor
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm leading-snug">{insight.message}</span>
            {topic && (
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {topic.name}
              </span>
            )}
          </div>
          {insight.detail && (
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              {insight.detail}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{formatTime(insight.createdAt)}</span>
          </div>
          {insight.followUpQuestion && (
            <button
              type="button"
              onClick={handleFollowUp}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/5 px-2.5 py-1.5 text-xs text-accent hover:bg-accent/10 hover:border-accent/40 transition-colors"
            >
              <MessageSquare className="h-3 w-3 shrink-0" />
              <span className="truncate">{insight.followUpQuestion}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InsightsExpandedView() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const { setCommandRoomOverlay, currentContext } = useAppStore();

  const raw = getInsightsForContext(currentContext);
  const filtered =
    severityFilter === "all"
      ? raw
      : raw.filter((i) => i.severity === severityFilter);

  const sorted = [...filtered].sort((a, b) => {
    const sa = severityOrder.indexOf(a.severity);
    const sb = severityOrder.indexOf(b.severity);
    if (sa !== sb) return sa - sb;
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <button
        onClick={() => setCommandRoomOverlay(null)}
        className="flex shrink-0 items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Chat
      </button>
      <div className="flex flex-1 flex-col overflow-hidden px-4 pb-6">
        <h2 className="text-lg font-semibold">All Insights</h2>
        <div className="mt-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="mt-4 flex-1 space-y-2 overflow-auto">
          {sorted.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
