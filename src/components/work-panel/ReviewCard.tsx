"use client";

import { FileText, Database, Mail, CheckSquare, ClipboardCheck, ChevronRight } from "lucide-react";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import { getActionLabel } from "@/data/review-items";
import type { ReviewItem } from "@/data/review-items";

const typeIcons: Record<string, React.ElementType> = {
  meeting_notes: FileText,
  weekly_report: FileText,
  crm_update: Database,
  email_draft: Mail,
  follow_up: CheckSquare,
  meeting_prep: ClipboardCheck,
};

interface ReviewCardProps {
  item: ReviewItem;
  showTopic?: boolean;
}

export function ReviewCard({ item, showTopic }: ReviewCardProps) {
  const setCommandRoomOverlay = useAppStore((s) => s.setCommandRoomOverlay);
  const setActiveReviewItemId = useAppStore((s) => s.setActiveReviewItemId);

  const Icon = typeIcons[item.type] ?? FileText;
  const topic = showTopic ? getTopicById(item.topicId) : null;
  const actionLabel = getActionLabel(item.type);

  const handleClick = () => {
    setCommandRoomOverlay("review");
    setActiveReviewItemId(item.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
      className="cursor-pointer bg-white shadow-sm border border-stone-200 rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-xl p-1.5 bg-stone-100">
          <Icon className="h-4 w-4 text-stone-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm">{item.title}</span>
            {topic && (
              <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
                {topic.name}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-stone-500 leading-relaxed">
            {item.summary}
          </p>
        </div>
        {actionLabel && (
          <div className="flex items-center gap-0.5 shrink-0 self-center">
            <span className="text-[11px] font-medium text-orange-600">{actionLabel}</span>
            <ChevronRight className="h-3.5 w-3.5 text-orange-600" />
          </div>
        )}
      </div>
    </div>
  );
}
