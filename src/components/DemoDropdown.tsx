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
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-4 py-2 shadow-md shadow-orange-500/20 transition-all font-bold text-sm"
      >
        <Play className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Select demo</span>
      </button>
    </div>
  );
}
