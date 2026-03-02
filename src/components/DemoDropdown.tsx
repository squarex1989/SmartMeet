"use client";

import { Play } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function DemoDropdown({ className }: { className?: string }) {
  const setDemoDocked = useAppStore((s) => s.setDemoDocked);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setDemoDocked(true);
        }}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border border-border bg-surface-2 text-muted-foreground hover:text-foreground hover:border-accent/20 transition-colors"
      >
        <Play className="h-3 w-3" />
        <span className="hidden sm:inline">Select demo</span>
      </button>
    </div>
  );
}
