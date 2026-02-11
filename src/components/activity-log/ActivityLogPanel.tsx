"use client";

import { useAppStore } from "@/store/useAppStore";
import { logsByAdvisor, allLogsMixed } from "@/data/logs";
import type { AdvisorId } from "@/data/advisors";
import { advisors } from "@/data/advisors";
import Link from "next/link";
import { Loader2, Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ActivityLogPanelProps = { onClose?: () => void; className?: string };

export function ActivityLogPanel({ onClose, className }: ActivityLogPanelProps) {
  const activeConversationId = useAppStore((s) => s.activeConversationId);

  const logs =
    activeConversationId === "group"
      ? allLogsMixed
      : activeConversationId
        ? logsByAdvisor[activeConversationId as AdvisorId] ?? []
        : [];

  return (
    <div data-tour-id="tour-activity-log" className={cn("flex h-full flex-col bg-background", onClose ? "w-full" : "w-72 shrink-0 border-l border-border", className)}>
      <div className="border-b border-border p-3 flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Activity Log
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose} aria-label="关闭">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground p-2">暂无活动</p>
        )}
        {logs.map((entry) => (
          <LogEntryRow key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function LogEntryRow({ entry }: { entry: (typeof allLogsMixed)[0] }) {
  const advisor = advisors.find((a) => a.id === entry.advisorId);
  const isProcessing = entry.status === "processing";
  const isWaiting = entry.status === "waiting";

  return (
    <div
      className={cn(
        "rounded-lg border p-2 text-sm transition",
        isWaiting && "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20"
      )}
    >
      <div className="flex items-start gap-2">
        <div
          className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5"
          style={{ border: `2px solid ${advisor?.color ?? "#ccc"}` }}
          title={advisor?.name}
        >
          {advisor?.name[0] ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{advisor?.name}</span>
            <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
            <span className="ml-auto shrink-0">
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : entry.status === "completed" || entry.status === "auto_done" ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-amber-500" />
              )}
            </span>
          </div>
          <p className="text-sm">{entry.description}</p>
          {entry.resourceId && (
            <Link
              href={`/app/doc?id=${entry.resourceId}`}
              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
            >
              查看
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
