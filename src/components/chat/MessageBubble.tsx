import { Fragment } from "react";
import { FileText, CheckCircle, Loader2, XCircle, Calendar, AlertTriangle, Info, Clock, Lightbulb, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, MessageContent } from "@/data/chat-messages";
import { useAppStore } from "@/store/useAppStore";

function InlineBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines.filter((l) => !l.match(/^\|[\s-:|]+\|$/));
  const parsed = rows.map((r) =>
    r.split("|").slice(1, -1).map((c) => c.trim())
  );
  if (parsed.length === 0) return null;
  const [header, ...body] = parsed;
  return (
    <div className="overflow-x-auto my-2 text-xs">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-border">
            {header.map((h, i) => (
              <th key={i} className="text-left py-1.5 pr-4 text-muted-foreground font-medium">
                <InlineBold text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-border/40 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="py-1.5 pr-4">
                  <InlineBold text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: { type: "text" | "table"; lines: string[] }[] = [];
  let current: { type: "text" | "table"; lines: string[] } = { type: "text", lines: [] };

  for (const line of lines) {
    const isTableLine = line.trimStart().startsWith("|") && line.trimEnd().endsWith("|");
    if (isTableLine) {
      if (current.type !== "table") {
        if (current.lines.length) blocks.push(current);
        current = { type: "table", lines: [] };
      }
      current.lines.push(line);
    } else {
      if (current.type !== "text") {
        if (current.lines.length) blocks.push(current);
        current = { type: "text", lines: [] };
      }
      current.lines.push(line);
    }
  }
  if (current.lines.length) blocks.push(current);

  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "table") {
          return <MarkdownTable key={i} lines={block.lines} />;
        }
        const joined = block.lines.join("\n");
        return (
          <Fragment key={i}>
            <InlineBold text={joined} />
          </Fragment>
        );
      })}
    </>
  );
}

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
          <span className="text-xs font-medium text-stone-500 mb-1.5 ml-1">Shadow</span>
        )}
        <div
          className={cn(
            "px-4 py-3 space-y-2 shadow-sm",
            isUser
              ? "bg-orange-100 text-stone-900 rounded-3xl rounded-tr-md"
              : "bg-stone-50 text-stone-800 rounded-3xl rounded-tl-md"
          )}
        >
          {message.content.map((item, i) => (
            <ContentBlock
              key={i}
              content={item}
              isUser={isUser}
              topicId={message.topicId}
              onDocClick={handleDocClick}
              onTopicClick={setCurrentContext}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const actionButtonResponses: Record<string, { userText: string; aiText: string }> = {
  draft_email: {
    userText: "帮我起草邮件",
    aiText: "好的，我根据 CloudFlow 的沟通历史和续约情况起草了一封关怀邮件：",
  },
  view_proposal: {
    userText: "先看续约提案",
    aiText: "这是 CloudFlow 的续约提案概要：\n\n合同期限：2026.04 — 2027.04（12 个月）\n年费：$48,000（与去年持平）\n服务内容：全栈云部署 + 7×24 技术支持 + 季度业务回顾\n\n根据风险信号，我建议考虑以下调整：\n1. 赠送 1 个月免费服务期，释放善意\n2. 新增「自动化部署优化」作为增值服务\n3. SLA 从 99.5% 升级至 99.9%\n\n需要我按这个方向更新提案文档吗？",
  },
  send_email: {
    userText: "确认发送",
    aiText: "邮件已发送给 james.chen@cloudflow.io ✓\n\n我会持续关注 James 的回复情况，如果 48 小时内没有回复，会提醒你跟进。",
  },
  edit_email: {
    userText: "修改内容",
    aiText: "好的，请告诉我你想修改哪些内容？比如：\n\n- 调整语气（更正式 / 更轻松）\n- 修改会议时间建议\n- 增加或删除某些话题\n- 其他修改",
  },
};

function ContentBlock({
  content,
  isUser,
  topicId,
  onDocClick,
  onTopicClick,
}: {
  content: MessageContent;
  isUser: boolean;
  topicId: string;
  onDocClick: (docId: string) => void;
  onTopicClick: (topicId: string) => void;
}) {
  if (content.type === "text" && content.text) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed">
        <RichText text={content.text} />
      </p>
    );
  }

  if (content.type === "meeting_list" && content.meetings) {
    return (
      <div className="mt-1 space-y-3">
        {content.meetings.map((m) => {
          const statusDot = m.status === "ready"
            ? "bg-green-500"
            : m.status === "preparing"
              ? "bg-accent"
              : "bg-blue-400";

          return (
            <div key={m.eventId} className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">{m.time}</span>
                <span className={cn("inline-block h-1.5 w-1.5 rounded-full shrink-0", statusDot)} />
                <span className="font-medium truncate flex-1">{m.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const store = useAppStore.getState();
                    store.setMainView("calendar");
                    store.setSelectedEventId(m.eventId);
                  }}
                  className="shrink-0 rounded-lg bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent hover:bg-accent/20 transition-colors"
                >
                  详情
                </button>
              </div>
              {m.prepDocs && m.prepDocs.length > 0 && (
                <div className="ml-[1.375rem] flex flex-wrap gap-1.5">
                  {m.prepDocs.map((doc) => (
                    <button
                      key={doc.docId}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocClick(doc.docId);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[140px]">{doc.docTitle}</span>
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
    const borderColor = level === "critical" ? "border-red-200" : level === "warning" ? "border-amber-200" : "border-blue-200";
    const bgColor = level === "critical" ? "bg-red-50" : level === "warning" ? "bg-amber-50" : "bg-blue-50";
    const textColor = level === "critical" ? "text-red-700" : level === "warning" ? "text-amber-700" : "text-blue-700";
    const AlertIcon = level === "critical" || level === "warning" ? AlertTriangle : Info;

    return (
      <div className={cn("flex items-start gap-2.5 rounded-xl border px-3.5 py-3 mt-1", borderColor, bgColor)}>
        <AlertIcon className={cn("h-4 w-4 mt-0.5 shrink-0", textColor)} />
        <p className={cn("text-sm leading-relaxed", textColor)}><RichText text={content.text} /></p>
      </div>
    );
  }

  if (content.type === "overdue_followups" && content.overdueTasks) {
    return (
      <div className="rounded-xl border border-border bg-background/60 px-3.5 py-3 mt-1 space-y-2.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-sm">{content.text}</p>
        </div>
        <div className="space-y-1.5">
          {content.overdueTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTopicClick(task.topicId);
              }}
              className="flex w-full items-center gap-2 rounded-lg bg-background px-3 py-2 text-left hover:bg-surface-2 transition-colors"
            >
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="text-xs font-medium truncate flex-1">{task.label}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">逾期 {task.daysOverdue} 天</span>
            </button>
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
          "flex items-center gap-2.5 p-3 rounded-xl border text-left w-full transition-colors",
          isUser
            ? "border-accent/20 hover:bg-accent/10"
            : "border-border hover:bg-background bg-background/50"
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
    const handleActionClick = (action: string) => {
      const resp = actionButtonResponses[action];
      if (!resp) return;
      const store = useAppStore.getState();
      const now = new Date().toISOString();
      const uid = `btn-${Date.now()}`;
      store.injectMessages(topicId, [
        {
          id: `${uid}-u`,
          topicId: topicId as never,
          role: "user",
          content: [{ type: "text", text: resp.userText }],
          createdAt: now,
        },
        {
          id: `${uid}-a`,
          topicId: topicId as never,
          role: "shadow",
          content: [{ type: "text", text: resp.aiText }],
          createdAt: new Date(Date.now() + 1000).toISOString(),
        },
      ]);
    };

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {content.buttons.map((b) => (
          <button
            key={b.action}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick(b.action);
            }}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg border shrink-0 transition-colors font-medium",
              isUser
                ? "border-accent/20 hover:bg-accent/10"
                : "border-border hover:bg-background bg-background/50"
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
    );
  }

  if (content.type === "crm_preview" && content.crmFields) {
    const hasCol3 = content.crmFields.some((f) => f.col3);
    return (
      <div className="text-xs overflow-x-auto">
        <table className="min-w-full">
          <tbody>
            {content.crmFields.map((f, i) => {
              const isHeader = !f.name;
              const cellBase = "py-2 pr-4";
              const headerStyle = "font-semibold text-foreground";
              return (
                <tr key={i} className="border-b border-border/40 last:border-0">
                  <td className={cn(cellBase, "text-muted-foreground whitespace-nowrap")}>{f.name}</td>
                  <td className={cn(cellBase, isHeader && headerStyle)}>{f.from}</td>
                  {f.to != null && <td className={cn(cellBase, isHeader && headerStyle)}>{f.to}</td>}
                  {hasCol3 && <td className={cn(cellBase, isHeader && headerStyle)}>{f.col3 || ""}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (content.type === "email_preview" && content.email) {
    const e = content.email;
    return (
      <div className="text-xs rounded-xl border border-border bg-background/50 p-3 space-y-1.5">
        <p><span className="text-muted-foreground">To:</span> {e.to}</p>
        {e.cc && <p><span className="text-muted-foreground">CC:</span> {e.cc}</p>}
        <p><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{e.subject}</span></p>
        <p className="text-muted-foreground whitespace-pre-wrap mt-2 leading-relaxed">{e.body}</p>
      </div>
    );
  }

  if (content.type === "transcript_quote" && content.quote) {
    const q = content.quote;
    return (
      <blockquote className="border-l-2 border-accent/30 pl-3 my-1 italic text-sm">
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
        <Icon className={cn("h-4 w-4 shrink-0", spinning && "animate-spin", content.statusIcon === "success" && "text-green-500")} />
        <span>{content.text}</span>
      </div>
    );
  }

  if (content.type === "playbook_update" && content.playbookRule) {
    const rule = content.playbookRule;
    return (
      <div className="mt-1 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 shrink-0 text-accent" />
          <span className="text-xs font-semibold text-accent">Playbook Updated</span>
        </div>
        <p className="text-sm leading-relaxed">{rule.description}</p>
        <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent">
          {rule.trigger}
        </span>
      </div>
    );
  }

  if (content.type === "insights_summary" && content.insightItems) {
    return (
      <div className="space-y-1.5 mt-1">
        {content.insightItems.map((item) => (
          <div key={item.id} className="flex items-start gap-2 rounded-xl border border-border bg-background/50 px-3 py-2.5">
            <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <p className="text-xs font-medium flex-1 min-w-0">{item.label}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
