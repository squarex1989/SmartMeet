import { cn } from "@/lib/utils";
import { getTopicById } from "@/data/topics";
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
  const dotColor = severityDot[insight.severity] ?? "bg-muted-foreground";
  const topic =
    showTopic && insight.topicId ? getTopicById(insight.topicId) : null;

  return (
    <div className="interactive-subtle rounded-lg bg-surface-1 px-3 py-2.5 hover:bg-surface-2 transition-colors">
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
                <span className="text-border">·</span>
                <span>{topic.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
