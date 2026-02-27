"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import type { Insight } from "@/data/insights";

function formatTimeAgo(iso: string): string {
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

const severityDot: Record<string, string> = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-400",
};

interface SignalCardProps {
  insight: Insight;
  showTopic?: boolean;
}

export function SignalCard({ insight, showTopic }: SignalCardProps) {
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setCommandRoomOverlay = useAppStore((s) => s.setCommandRoomOverlay);
  const setChatInputValue = useAppStore((s) => s.setChatInputValue);

  const dotColor = severityDot[insight.severity] ?? "bg-muted-foreground";
  const topic =
    showTopic && insight.topicId ? getTopicById(insight.topicId) : null;

  const handleFollowUp = () => {
    if (!insight.followUpQuestion) return;
    setCurrentContext(insight.topicId ?? "all");
    setCommandRoomOverlay(null);
    setChatInputValue(insight.followUpQuestion);
  };

  return (
    <div className="rounded-xl bg-background px-3 py-2.5 hover:bg-surface-2 transition-colors">
      <div className="flex items-start gap-2.5">
        <span className={cn("mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full", dotColor)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm leading-snug">{insight.message}</span>
          </div>
          {insight.detail && (
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              {insight.detail}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{formatTimeAgo(insight.createdAt)}</span>
            {topic && (
              <>
                <span className="text-border">&middot;</span>
                <span>{topic.name}</span>
              </>
            )}
          </div>
          {insight.followUpQuestion && (
            <button
              type="button"
              onClick={handleFollowUp}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/5 px-2 py-1 text-[11px] text-accent hover:bg-accent/10 hover:border-accent/40 transition-colors max-w-full"
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
