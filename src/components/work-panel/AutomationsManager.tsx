"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
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
  const [expanded, setExpanded] = useState(false);
  const topic =
    rule.scope !== "global" ? getTopicById(rule.scope as TopicId) : null;
  return (
    <div
      className="bg-white shadow-sm border border-stone-200 rounded-2xl cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm">{rule.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              {rule.trigger}
            </span>
            {topic && (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                {topic.name}
              </span>
            )}
            {rule.requiresReview && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                Review required
              </span>
            )}
          </div>
        </div>
        {rule.ruleDetail && (
          expanded
            ? <ChevronDown className="h-4 w-4 shrink-0 mt-0.5 text-stone-400" />
            : <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-stone-400" />
        )}
      </div>
      {expanded && (
        <div className="border-t border-stone-200 px-4 py-3 space-y-3">
          {rule.ruleDetail && (
            <p className="text-xs text-stone-500 leading-relaxed">{rule.ruleDetail}</p>
          )}
          {rule.actions.length > 0 && (
            <ul className="list-inside list-disc text-xs text-stone-500">
              {rule.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-2 w-8 rounded-full",
                  rule.enabled ? "bg-status-executed" : "bg-muted"
                )}
              />
              {rule.lastTriggered && (
                <span className="text-[10px] text-stone-500">
                  Last: {formatTime(rule.lastTriggered)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Editing: ${rule.description}`);
              }}
              className="text-xs text-orange-600 hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
      )}
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
    <div className="flex h-full w-full flex-col overflow-hidden bg-transparent px-2 py-4">
      {!standalone && (
        <button
          onClick={() => setCommandRoomOverlay(null)}
          className="interactive-base flex shrink-0 items-center gap-2 px-4 py-3 text-sm text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}
      <div className="flex flex-1 flex-col overflow-hidden px-4 pb-6 pt-2">
        <div className="mt-1 flex gap-1 border-b border-stone-200">
          <button
            onClick={() => setTab("global")}
            className={cn(
              "interactive-subtle px-3 py-2 text-sm",
              tab === "global"
                ? "border-b-2 border-orange-500 font-medium text-orange-600"
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            Global Playbook
          </button>
          <button
            onClick={() => setTab("topic")}
            className={cn(
              "interactive-subtle px-3 py-2 text-sm",
              tab === "topic"
                ? "border-b-2 border-orange-500 font-medium text-orange-600"
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            Topic Playbook
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
                      <h3 className="mb-2 text-sm font-medium text-stone-500">
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
          className="mt-4 w-full rounded-2xl border border-dashed border-stone-300 py-3 text-sm text-stone-500 hover:bg-orange-100/40 hover:text-stone-800 hover:border-orange-300 transition-colors"
          type="button"
        >
          + Add Playbook Rule
        </button>
      </div>
    </div>
  );
}
