"use client";

import { CalendarX, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getEventsForDate, getEventById } from "@/data/calendar";
import { CalendarToolbar } from "./CalendarToolbar";
import { MeetingCard } from "./MeetingCard";
import { EventDetail } from "./EventDetail";

export function CalendarView() {
  const calendarDate = useAppStore((s) => s.calendarDate);
  const selectedEventId = useAppStore((s) => s.selectedEventId);
  const setSelectedEventId = useAppStore((s) => s.setSelectedEventId);

  const events = getEventsForDate(calendarDate).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const selectedEvent = selectedEventId ? getEventById(selectedEventId) : null;

  const eventList = (
    <>
      <div className="border-b border-border shrink-0">
        <CalendarToolbar />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <CalendarX className="h-10 w-10 opacity-40" />
            <p className="text-sm">当天没有日程</p>
          </div>
        ) : (
          events.map((event) => (
            <MeetingCard
              key={event.id}
              event={event}
              isSelected={selectedEventId === event.id}
              onClick={() => setSelectedEventId(event.id)}
            />
          ))
        )}
      </div>
    </>
  );

  const detailPane = selectedEvent ? (
    <EventDetail event={selectedEvent} />
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
      <p className="text-sm">在左侧选择一个日程查看详情</p>
    </div>
  );

  return (
    <div className="flex flex-1 min-w-0 h-full">
      {/* Desktop: side-by-side */}
      <aside className="hidden md:flex shrink-0 w-[380px] flex-col border-r border-border bg-background overflow-hidden">
        {eventList}
      </aside>
      <div className="hidden md:flex flex-1 min-w-0 overflow-y-auto h-full">
        {detailPane}
      </div>

      {/* Mobile: master-detail switch */}
      <div className="flex md:hidden flex-1 min-w-0 h-full flex-col bg-background overflow-hidden">
        {selectedEvent ? (
          <>
            <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border">
              <button
                type="button"
                onClick={() => setSelectedEventId(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                返回日程
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EventDetail event={selectedEvent} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {eventList}
          </div>
        )}
      </div>
    </div>
  );
}
