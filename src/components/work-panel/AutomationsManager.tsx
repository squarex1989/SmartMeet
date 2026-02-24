"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  getGlobalAutomations,
  automations,
} from "@/data/automations";
import { getTopicById } from "@/data/topics";
import type { TopicId } from "@/data/topics";
import type { Automation } from "@/data/automations";
import { cn } from "@/lib/utils";

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

function AutomationCard({ rule }: { rule: Automation }) {
  const topic =
    rule.scope !== "global" ? getTopicById(rule.scope as TopicId) : null;
  return (
    <div className="interactive-subtle rounded-lg border border-border bg-surface-1 p-4 hover:border-accent/20">
      <p className="text-sm">{rule.description}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {rule.trigger}
        </span>
        {topic && (
          <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {topic.name}
          </span>
        )}
        {rule.requiresReview && (
          <span className="rounded bg-status-pending/20 px-2 py-0.5 text-xs text-status-pending">
            Review required
          </span>
        )}
      </div>
      {rule.actions.length > 0 && (
        <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
          {rule.actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between">
        <div
          className={cn(
            "h-2 w-8 rounded-full",
            rule.enabled ? "bg-status-executed" : "bg-muted"
          )}
        />
        {rule.lastTriggered && (
          <span className="text-[10px] text-muted-foreground">
            Last: {formatTime(rule.lastTriggered)}
          </span>
        )}
      </div>
    </div>
  );
}

export function AutomationsManager({ standalone }: { standalone?: boolean } = {}) {
  const [tab, setTab] = useState<"global" | "topic">("global");
  const { setCommandRoomOverlay } = useAppStore();

  const globalRules = getGlobalAutomations();

  const allTopicRules = automations.filter((a) => a.scope !== "global");
  const topicGroups = (() => {
    const map = new Map<TopicId, Automation[]>();
    for (const a of allTopicRules) {
      const tid = a.scope as TopicId;
      if (!map.has(tid)) map.set(tid, []);
      map.get(tid)!.push(a);
    }
    return Array.from(map.entries());
  })();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {!standalone && (
        <button
          onClick={() => setCommandRoomOverlay(null)}
          className="interactive-base flex shrink-0 items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}
      <div className="flex flex-1 flex-col overflow-hidden px-4 pb-6 pt-4">
        <h2 className="text-lg font-semibold">Manage Automations</h2>
        <div className="mt-3 flex gap-1 border-b border-border">
          <button
            onClick={() => setTab("global")}
            className={cn(
              "interactive-subtle px-3 py-2 text-sm",
              tab === "global"
                ? "border-b-2 border-accent font-medium text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Global Rules
          </button>
          <button
            onClick={() => setTab("topic")}
            className={cn(
              "interactive-subtle px-3 py-2 text-sm",
              tab === "topic"
                ? "border-b-2 border-accent font-medium text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Topic Rules
          </button>
        </div>
        <div className="mt-4 flex-1 overflow-auto">
          {tab === "global" && (
            <div className="space-y-3">
              {globalRules.map((r) => (
                <AutomationCard key={r.id} rule={r} />
              ))}
            </div>
          )}
          {tab === "topic" && (
            <div className="space-y-6">
              {topicGroups.map(([topicId, rules]) => {
                const topic = getTopicById(topicId);
                return (
                  <div key={topicId}>
                    {topic && (
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                        {topic.name}
                      </h3>
                    )}
                    <div className="space-y-3">
                      {rules.map((r) => (
                        <AutomationCard key={r.id} rule={r} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button
          className="interactive-base mt-4 w-full rounded-md border border-dashed border-border py-3 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground hover:border-accent/30"
          type="button"
        >
          + Add Rule
        </button>
      </div>
    </div>
  );
}
