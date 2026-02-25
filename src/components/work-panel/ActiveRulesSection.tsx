"use client";

import { useState } from "react";
import { Zap, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  getAutomationsForContext,
  type Automation,
} from "@/data/automations";

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

function RuleRow({ rule }: { rule: Automation }) {
  const [expanded, setExpanded] = useState(false);
  const setMainView = useAppStore((s) => s.setMainView);

  return (
    <div className="rounded border border-border bg-surface-1 text-xs">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-2 p-2 text-left hover:bg-muted/50 transition-colors rounded"
      >
        <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground">{rule.description}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
              {rule.trigger}
            </span>
            {rule.lastTriggered && (
              <span className="text-[10px] text-muted-foreground">
                {formatTimeAgo(rule.lastTriggered)}
              </span>
            )}
          </div>
        </div>
        {rule.ruleDetail && (
          expanded
            ? <ChevronDown className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
        )}
      </button>
      {expanded && rule.ruleDetail && (
        <div className="border-t border-border px-2 py-2 space-y-2">
          <p className={cn("text-[11px] text-muted-foreground leading-relaxed")}>{rule.ruleDetail}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMainView("automations");
            }}
            className="text-[10px] text-accent hover:underline"
          >
            Edit in Playbook →
          </button>
        </div>
      )}
    </div>
  );
}

const MAX_VISIBLE_RULES = 4;

export function ActiveRulesSection() {
  const currentContext = useAppStore((s) => s.currentContext);
  const setMainView = useAppStore((s) => s.setMainView);

  const rules = getAutomationsForContext(currentContext).filter(
    (a) => a.enabled
  );
  const visibleRules = rules.slice(0, MAX_VISIBLE_RULES);

  return (
    <div className="space-y-2">
      {visibleRules.map((rule) => (
        <RuleRow key={rule.id} rule={rule} />
      ))}
      <button
        type="button"
        onClick={() => setMainView("automations")}
        className="interactive-base text-xs text-muted-foreground hover:text-accent hover:underline"
      >
        Manage Playbook →
      </button>
    </div>
  );
}

export function usePlaybookCount() {
  const currentContext = useAppStore((s) => s.currentContext);
  return getAutomationsForContext(currentContext).filter((a) => a.enabled).length;
}
