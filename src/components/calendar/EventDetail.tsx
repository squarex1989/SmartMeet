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
  client: "bg-topic-client/10 text-topic-client border-topic-client/20",
  project: "bg-topic-project/10 text-topic-project border-topic-project/20",
  goal: "bg-topic-goal/10 text-topic-goal border-topic-goal/20",
} as const;

const statusStyles = {
  past: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  ongoing:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse",
  upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
} as const;

const taskStatusStyles = {
  done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending_review:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
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
      : "bg-muted text-muted-foreground";

  const handleNotesClick = (docId: string) => {
    setMainView("docs");
    setOpenDocumentId(docId);
  };

  const handleAgendaClick = (docId: string) => {
    setMainView("docs");
    setOpenDocumentId(docId);
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
              className="interactive-base inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Video className="h-4 w-4" />
              加入会议
            </button>
          )}
          {status === "past" && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-border hover:bg-muted"
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
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted text-left w-full"
                >
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{doc.title}</span>
                </button>
              ) : null;
            })()}
            {event.outcome.crmUpdated && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                <Database className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium">CRM Updated</span>
              </div>
            )}
            {event.outcome.emailSent && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm">
                  Email sent to {event.outcome.emailSent.to}, subject:{" "}
                  {event.outcome.emailSent.subject}
                </span>
              </div>
            )}
            {event.outcome.followUpTasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
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
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted text-left w-full"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="font-medium">Agenda: {doc.title}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="font-medium">Agenda</span>
                </div>
              );
            })()}
            {event.prep.clientSummary && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Client summary
                </h3>
                <p className="text-sm">{event.prep.clientSummary}</p>
              </div>
            )}
            {event.prep.recommendedQuestions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Recommended questions
                </h3>
                <ul className="space-y-2">
                  {event.prep.recommendedQuestions.map((q, i) => (
                    <li key={i} className="text-sm">
                      {q.reason ? (
                        <span>
                          {q.question}{" "}
                          <span className="text-muted-foreground">
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
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
    <li className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg border border-border bg-background">
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
