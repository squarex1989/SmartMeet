"use client";

import { Video } from "lucide-react";
import { toast } from "sonner";
import { getEventStatus, type CalendarEvent } from "@/data/calendar";
import { getTopicById } from "@/data/topics";
import { cn } from "@/lib/utils";

function formatTimeRange(start: string, end: string): string {
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(new Date(start))} - ${fmt(new Date(end))}`;
}

const statusLabel = {
  past: "已结束",
  ongoing: "进行中",
  upcoming: "即将开始",
} as const;

const statusColor = {
  past: "text-stone-500",
  ongoing: "text-green-600",
  upcoming: "text-orange-600",
} as const;

interface MeetingCardProps {
  event: CalendarEvent;
  isSelected: boolean;
  onClick: () => void;
}

export function MeetingCard({ event, isSelected, onClick }: MeetingCardProps) {
  const topic = getTopicById(event.topicId);
  const status = getEventStatus(event);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "rounded-2xl p-4 cursor-pointer bg-stone-50 shadow-sm border border-stone-200",
        isSelected
          ? "ring-2 ring-orange-400/40"
          : ""
      )}
    >
      <h3 className="font-semibold text-sm text-stone-800">{event.title}</h3>
      <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
        <span>{formatTimeRange(event.start, event.end)}</span>
        {status === "ongoing" && <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
        <span className={cn("font-medium", statusColor[status])}>
          {statusLabel[status]}
        </span>
      </div>
      {topic && (
        <div className="mt-1.5 text-xs text-stone-500">
          Organizer: {topic.name}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        {(status === "upcoming" || status === "ongoing") && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20"
            onClick={(e) => {
              e.stopPropagation();
              toast("会议室功能即将上线");
            }}
          >
            加入会议
          </button>
        )}
        {status === "past" && event.outcome && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Video className="h-3 w-3" />
            Recording
          </button>
        )}
      </div>
    </div>
  );
}
