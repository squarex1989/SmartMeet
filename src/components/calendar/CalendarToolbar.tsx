"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDisplay(dateStr: string): string {
  return dateStr.replace(/-/g, " / ");
}

export function CalendarToolbar() {
  const calendarDate = useAppStore((s) => s.calendarDate);
  const setCalendarDate = useAppStore((s) => s.setCalendarDate);

  return (
    <div className="flex items-center gap-2 p-4">
      <button
        type="button"
        onClick={() => setCalendarDate(shiftDate(calendarDate, -1))}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-surface-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="relative flex-1">
        <input
          type="date"
          value={calendarDate}
          onChange={(e) => setCalendarDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <span className="text-sm font-medium">{formatDisplay(calendarDate)}</span>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setCalendarDate(shiftDate(calendarDate, 1))}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-surface-2"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
