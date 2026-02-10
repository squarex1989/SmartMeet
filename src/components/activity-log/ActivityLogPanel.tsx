"use client";

import { useAppStore } from "@/store/useAppStore";
import { logsByAdvisor, allLogsMixed } from "@/data/logs";
import type { AdvisorId } from "@/data/advisors";
import { advisors } from "@/data/advisors";
import Link from "next/link";
import { Loader2, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActivityLogPanel() {
  const activeConversationId = useAppStore((s) => s.activeConversationId);

  const logs =
    activeConversationId === "group"
      ? allLogsMixed
      : activeConversationId
        ? logsByAdvisor[activeConversationId as AdvisorId] ?? []
        : [];

  return (
    <div className="flex h-full flex-col border-l border-border bg-background w-72 shrink-0">
      <div className="border-b border-border p-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Activity Log
        </h3>
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
        <div className="shrink-0 mt-0.5">
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : entry.status === "completed" || entry.status === "auto_done" ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Clock className="h-4 w-4 text-amber-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
          <p className="font-medium">{entry.description}</p>
          {entry.resourceId && (
            <Link
              href={`/app/doc?id=${entry.resourceId}`}
              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
            >
              查看
            </Link>
          )}
        </div>
        {entry.resourceType === "doc" && advisor && (
          <div
            className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs shrink-0"
            style={{ border: `2px solid ${advisor.color}` }}
            title={advisor.name}
          >
            {advisor.name[0]}
          </div>
        )}
      </div>
    </div>
  );
}
