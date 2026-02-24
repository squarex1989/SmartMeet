import { FileText, CheckCircle, Loader2, XCircle, Calendar, AlertTriangle, Info, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ChatMessage, MessageContent } from "@/data/chat-messages";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const setMainView = useAppStore((s) => s.setMainView);
  const setOpenDocumentId = useAppStore((s) => s.setOpenDocumentId);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);

  const handleDocClick = (docId: string) => {
    setMainView("docs");
    setOpenDocumentId(docId);
  };

  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
        {!isUser && (
          <span className="text-xs text-muted-foreground mb-1">Shadow</span>
        )}
        <div
          className={cn(
            "rounded-lg px-3 py-2 space-y-2",
            isUser ? "bg-foreground text-background" : "bg-muted"
          )}
        >
          {message.content.map((item, i) => (
            <ContentBlock
              key={i}
              content={item}
              isUser={isUser}
              onDocClick={handleDocClick}
              onTopicClick={setCurrentContext}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentBlock({
  content,
  isUser,
  onDocClick,
  onTopicClick,
}: {
  content: MessageContent;
  isUser: boolean;
  onDocClick: (docId: string) => void;
  onTopicClick: (topicId: string) => void;
}) {
  if (content.type === "text" && content.text) {
    return <p className="whitespace-pre-wrap text-sm">{content.text}</p>;
  }

  if (content.type === "meeting_list" && content.meetings) {
    return (
      <div className="space-y-1 mt-1">
        {content.meetings.map((m) => {
          const topic = getTopicById(m.topicId);
          const statusDot = m.status === "ready"
            ? "bg-green-500"
            : m.status === "preparing"
              ? "bg-amber-500"
              : "bg-blue-500";

          return (
            <div key={m.eventId} className="space-y-1">
              <div className="flex items-center gap-2.5 py-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tabular-nums w-14 shrink-0">{m.time}</span>
                <span className={cn("inline-block h-1.5 w-1.5 rounded-full shrink-0", statusDot)} />
                <span className="font-medium truncate">{m.title}</span>
                {topic && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onTopicClick(m.topicId); }}
                    className="interactive-subtle shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    {topic.name}
                  </button>
                )}
                <span className="ml-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const store = useAppStore.getState();
                      store.setMainView("calendar");
                      store.setSelectedEventId(m.eventId);
                    }}
                    className="interactive-base shrink-0 rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground hover:bg-accent/90"
                  >
                    详情
                  </button>
                </span>
              </div>
              {m.prepDocs && m.prepDocs.length > 0 && (
                <div className="ml-[4.5rem] flex flex-wrap gap-1.5 pb-1">
                  {m.prepDocs.map((doc) => (
                    <button
                      key={doc.docId}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocClick(doc.docId);
                      }}
                      className="interactive-subtle inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{doc.docTitle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (content.type === "alert_card" && content.text) {
    const level = content.alertLevel ?? "info";
    const borderColor = level === "critical" ? "border-red-300 dark:border-red-800" : level === "warning" ? "border-amber-300 dark:border-amber-800" : "border-blue-300 dark:border-blue-800";
    const bgColor = level === "critical" ? "bg-red-50 dark:bg-red-900/20" : level === "warning" ? "bg-amber-50 dark:bg-amber-900/20" : "bg-blue-50 dark:bg-blue-900/20";
    const textColor = level === "critical" ? "text-red-800 dark:text-red-300" : level === "warning" ? "text-amber-800 dark:text-amber-300" : "text-blue-800 dark:text-blue-300";
    const AlertIcon = level === "critical" || level === "warning" ? AlertTriangle : Info;

    return (
      <div className={cn("flex items-start gap-2 rounded-lg border px-3 py-2.5 mt-1", borderColor, bgColor)}>
        <AlertIcon className={cn("h-4 w-4 mt-0.5 shrink-0", textColor)} />
        <p className={cn("text-sm", textColor)}>{content.text}</p>
      </div>
    );
  }

  if (content.type === "overdue_followups" && content.overdueTasks) {
    return (
      <div className="rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5 mt-1 space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-800 dark:text-amber-300" />
          <p className="text-sm text-amber-800 dark:text-amber-300">{content.text}</p>
        </div>
        <div className="space-y-1.5">
          {content.overdueTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-2 rounded-md bg-white/60 dark:bg-white/5 px-2.5 py-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium truncate">{task.label}</span>
                <span className="shrink-0 text-[10px] text-amber-600 dark:text-amber-400">逾期 {task.daysOverdue} 天</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success(`已发起 Follow Up: ${task.label}`);
                }}
                className="interactive-base shrink-0 inline-flex items-center gap-1 rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-amber-700"
              >
                <Send className="h-2.5 w-2.5" />
                一键 Follow Up
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (content.type === "doc_card" && content.docId) {
    return (
      <button
        type="button"
        onClick={() => onDocClick(content.docId!)}
        className={cn(
          "flex items-center gap-2 p-2 rounded border text-left w-full transition-colors",
          isUser
            ? "border-white/30 hover:bg-white/10"
            : "border-border hover:bg-muted/80 bg-background"
        )}
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-sm font-medium truncate">
          {content.docTitle ?? "Document"}
        </span>
        {content.pageCount != null && (
          <span className="text-xs text-muted-foreground shrink-0">
            {content.pageCount} pages
          </span>
        )}
      </button>
    );
  }

  if (content.type === "action_buttons" && content.buttons) {
    return (
      <div className="flex flex-wrap gap-2">
        {content.buttons.map((b) => (
          <button
            key={b.action}
            type="button"
            className={cn(
              "text-xs px-2 py-1 rounded border shrink-0",
              isUser
                ? "border-white/30 hover:bg-white/10"
                : "border-border hover:bg-muted/80"
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
    );
  }

  if (content.type === "crm_preview" && content.crmFields) {
    return (
      <div className="text-xs overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-1 pr-2 text-muted-foreground">Field</th>
              <th className="text-left py-1 pr-2 text-muted-foreground">from</th>
              <th className="text-left py-1">to</th>
            </tr>
          </thead>
          <tbody>
            {content.crmFields.map((f, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-1 pr-2 text-muted-foreground">{f.name}</td>
                <td className="py-1 pr-2">{f.from}</td>
                <td className="py-1">{f.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (content.type === "email_preview" && content.email) {
    const e = content.email;
    return (
      <div className="text-xs rounded border border-border p-2 space-y-1">
        <p><span className="text-muted-foreground">To:</span> {e.to}</p>
        {e.cc && <p><span className="text-muted-foreground">CC:</span> {e.cc}</p>}
        <p><span className="text-muted-foreground">Subject:</span> {e.subject}</p>
        <p className="text-muted-foreground whitespace-pre-wrap mt-2">{e.body}</p>
      </div>
    );
  }

  if (content.type === "transcript_quote" && content.quote) {
    const q = content.quote;
    return (
      <blockquote className="border-l-2 border-muted-foreground/30 pl-2 my-0 italic text-sm">
        <span className="text-muted-foreground font-medium">{q.speaker}:</span> &ldquo;{q.text}&rdquo;
      </blockquote>
    );
  }

  if (content.type === "status_update" && content.text) {
    const Icon =
      content.statusIcon === "success"
        ? CheckCircle
        : content.statusIcon === "error"
          ? XCircle
          : Loader2;
    const spinning = content.statusIcon === "loading";
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className={cn("h-4 w-4 shrink-0", spinning && "animate-spin")} />
        <span>{content.text}</span>
      </div>
    );
  }

  return null;
}
