"use client";

import {
  FileText,
  Database,
  Mail,
  Video,
  VideoOff,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getEventStatus,
  type CalendarEvent,
  type FollowUpTaskStatus,
} from "@/data/calendar";
import { getTopicById } from "@/data/topics";
import { getDocumentMeta } from "@/data/documents";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

function formatTimeRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(s)}–${fmt(e)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const topicColorMap = {
  client: "bg-orange-100 text-orange-600 border-orange-200",
  project: "bg-stone-100 text-stone-700 border-stone-200",
  goal: "bg-orange-100/70 text-orange-700 border-orange-200",
} as const;

const statusStyles = {
  past: "bg-stone-100 text-stone-700",
  ongoing: "bg-green-100 text-green-700 animate-pulse",
  upcoming: "bg-orange-100 text-orange-700",
} as const;

const taskStatusStyles = {
  done: "bg-green-100 text-green-700",
  pending_review: "bg-orange-100 text-orange-700",
  in_progress: "bg-stone-100 text-stone-700",
} as const;

interface EventDetailProps {
  event: CalendarEvent;
}

export function EventDetail({ event }: EventDetailProps) {
  const setMainView = useAppStore((s) => s.setMainView);
  const setOpenDocumentId = useAppStore((s) => s.setOpenDocumentId);

  const topic = getTopicById(event.topicId);
  const status = getEventStatus(event);
  const topicColor =
    topic && topic.type in topicColorMap
      ? topicColorMap[topic.type as keyof typeof topicColorMap]
      : "bg-stone-100 text-stone-500";

  const handleNotesClick = (docId: string) => {
    setMainView("docs");
    setOpenDocumentId(docId);
  };

  const handleAgendaClick = (docId: string) => {
    setMainView("docs");
    setOpenDocumentId(docId);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl text-stone-800">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <span>{formatTimeRange(event.start, event.end)}</span>
          <span>·</span>
          <span>{formatDate(event.start)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {topic && (
            <span
              className={cn(
                "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
                topicColor
              )}
            >
              {topic.name}
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize",
              statusStyles[status]
            )}
          >
            {status}
          </span>
        </div>
        <div>
          {(status === "upcoming" || status === "ongoing") && (
            <button
              type="button"
              onClick={() => toast("会议室功能即将上线")}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Video className="h-4 w-4" />
              加入会议
            </button>
          )}
          {status === "past" && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-stone-200 text-stone-700 hover:bg-stone-50"
            >
              <VideoOff className="h-4 w-4" />
              View Recording
            </button>
          )}
        </div>
      </div>

      {event.outcome && status === "past" && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Outputs</h2>
          <div className="flex flex-col gap-3">
            {event.outcome.summaryDocId && (() => {
              const doc = getDocumentMeta(event.outcome!.summaryDocId!);
              return doc ? (
                <button
                  type="button"
                  onClick={() => handleNotesClick(event.outcome!.summaryDocId!)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-md border-0 transition-transform hover:-translate-y-1 text-left w-full"
                >
                  <FileText className="h-5 w-5 text-stone-500 shrink-0" />
                  <span className="font-medium">{doc.title}</span>
                </button>
              ) : null;
            })()}
            {event.outcome.crmUpdated && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-md border-0">
                <Database className="h-5 w-5 text-stone-500 shrink-0" />
                <span className="text-sm font-medium">CRM Updated</span>
              </div>
            )}
            {event.outcome.emailSent && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-md border-0">
                <Mail className="h-5 w-5 text-stone-500 shrink-0" />
                <span className="text-sm">
                  Email sent to {event.outcome.emailSent.to}, subject:{" "}
                  {event.outcome.emailSent.subject}
                </span>
              </div>
            )}
            {event.outcome.followUpTasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-500">
                  Follow-up tasks
                </h3>
                <ul className="flex flex-col gap-2">
                  {event.outcome.followUpTasks.map((task) => (
                    <FollowUpTaskItem
                      key={task.id}
                      task={task}
                      onDocClick={handleNotesClick}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {event.prep && (status === "upcoming" || status === "ongoing") && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Preparation</h2>
          <div className="flex flex-col gap-4">
            {event.prep.agendaDocId && (() => {
              const doc = getDocumentMeta(event.prep!.agendaDocId!);
              return doc ? (
                <button
                  type="button"
                  onClick={() => handleAgendaClick(event.prep!.agendaDocId!)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-md border-0 transition-transform hover:-translate-y-1 text-left w-full"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="font-medium">Agenda: {doc.title}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-md border-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="font-medium">Agenda</span>
                </div>
              );
            })()}
            {event.prep.clientSummary && (
              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-2">
                  Client summary
                </h3>
                <p className="text-sm">{event.prep.clientSummary}</p>
              </div>
            )}
            {event.prep.recommendedQuestions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-2">
                  Recommended questions
                </h3>
                <ul className="space-y-2">
                  {event.prep.recommendedQuestions.map((q, i) => (
                    <li key={i} className="text-sm">
                      {q.reason ? (
                        <span>
                          {q.question}{" "}
                          <span className="text-stone-500">
                            ({q.reason})
                          </span>
                        </span>
                      ) : (
                        q.question
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {event.prep.openingScript && (
              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-2">
                  Opening script
                </h3>
                <p className="text-sm">{event.prep.openingScript}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function FollowUpTaskItem({
  task,
  onDocClick,
}: {
  task: FollowUpTaskStatus;
  onDocClick: (docId: string) => void;
}) {
  const doc = task.linkDocId ? getDocumentMeta(task.linkDocId) : null;
  const statusLabel =
    task.status === "pending_review"
      ? "Pending review"
      : task.status === "in_progress"
        ? "In progress"
        : "Done";

  return (
    <li className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl border border-stone-200 bg-white">
      <div className="flex items-center gap-2 min-w-0">
        {doc ? (
          <button
            type="button"
            onClick={() => onDocClick(task.linkDocId!)}
            className="text-sm font-medium hover:underline truncate text-left"
          >
            {task.label}
          </button>
        ) : (
          <span className="text-sm font-medium truncate">{task.label}</span>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium capitalize",
          taskStatusStyles[task.status]
        )}
      >
        {statusLabel}
      </span>
    </li>
  );
}
