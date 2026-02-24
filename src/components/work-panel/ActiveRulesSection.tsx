"use client";

import { Zap } from "lucide-react";
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
  return (
    <div className="interactive-subtle flex items-start gap-2 rounded border border-border bg-surface-1 p-2 text-xs">
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
    </div>
  );
}

export function ActiveRulesSection() {
  const currentContext = useAppStore((s) => s.currentContext);
  const setMainView = useAppStore((s) => s.setMainView);

  const rules = getAutomationsForContext(currentContext).filter(
    (a) => a.enabled
  );

  return (
    <div className="space-y-2">
      {rules.map((rule) => (
        <RuleRow key={rule.id} rule={rule} />
      ))}
      <button
        type="button"
        onClick={() => setMainView("automations")}
        className="interactive-base text-xs text-muted-foreground hover:text-accent hover:underline"
      >
        Manage automations →
      </button>
    </div>
  );
}
