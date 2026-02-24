"use client";

import { useState } from "react";
import { ArrowLeft, AlertTriangle, Info } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getInsightsForContext } from "@/data/insights";
import { getTopicById } from "@/data/topics";
import type { Insight, InsightSeverity } from "@/data/insights";
import { cn } from "@/lib/utils";

const severityOrder: InsightSeverity[] = ["critical", "warning", "info"];
const severityConfig = {
  critical: {
    border: "border-l-red-500",
    icon: AlertTriangle,
    iconClass: "text-red-500",
  },
  warning: {
    border: "border-l-orange-500",
    icon: AlertTriangle,
    iconClass: "text-orange-500",
  },
  info: {
    border: "border-l-blue-500",
    icon: Info,
    iconClass: "text-blue-500",
  },
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
  const config = severityConfig[insight.severity];
  const Icon = config.icon;
  const topic = insight.topicId ? getTopicById(insight.topicId) : null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border border-l-4 bg-background p-4",
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{insight.message}</span>
            {topic && (
              <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {topic.name}
              </span>
            )}
          </div>
          {insight.detail && (
            <p className="mt-1 text-sm text-muted-foreground">
              {insight.detail}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {formatTime(insight.createdAt)}
          </p>
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
        className="interactive-base flex shrink-0 items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
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
        <div className="mt-4 flex-1 space-y-3 overflow-auto">
          {sorted.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
