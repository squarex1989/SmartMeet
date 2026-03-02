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
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-orange-100/50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="relative flex-1">
        <input
          type="date"
          value={calendarDate}
          onChange={(e) => setCalendarDate(e.target.value)}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-transparent focus:outline-none focus:ring-2 focus:ring-orange-400/40 [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <span className="text-sm font-medium text-stone-800">{formatDisplay(calendarDate)}</span>
          <Calendar className="h-4 w-4 text-stone-500" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setCalendarDate(shiftDate(calendarDate, 1))}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-orange-100/50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
