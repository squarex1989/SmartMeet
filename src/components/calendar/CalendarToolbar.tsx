"use client";

import { useAppStore } from "@/store/useAppStore";

export function CalendarToolbar() {
  const calendarDate = useAppStore((s) => s.calendarDate);
  const setCalendarDate = useAppStore((s) => s.setCalendarDate);

  return (
    <div className="flex flex-col gap-3 p-4">
      <span className="text-sm font-medium text-muted-foreground">日期</span>
      <input
        type="date"
        value={calendarDate}
        onChange={(e) => setCalendarDate(e.target.value)}
        className="interactive-subtle rounded-lg border border-border bg-surface-1 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
