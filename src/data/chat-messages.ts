import type { TopicId } from "./topics";

export type MessageContentType =
  | "text"
  | "doc_card"
  | "action_buttons"
  | "crm_preview"
  | "email_preview"
  | "transcript_quote"
  | "status_update"
  | "meeting_list"
  | "alert_card"
  | "overdue_followups"
  | "insights_summary"
  | "playbook_update";

export interface MeetingPrepDoc {
  docId: string;
  docTitle: string;
}

export interface MeetingListItem {
  eventId: string;
  title: string;
  time: string;
  topicId: string;
  status: "ready" | "preparing" | "upcoming";
  statusText: string;
  prepDocs?: MeetingPrepDoc[];
}

export interface OverdueTask {
  id: string;
  label: string;
  topicId: string;
  daysOverdue: number;
  action: string;
}

export interface InsightBrief {
  id: string;
  label: string;
  severity: "info" | "warning" | "critical";
  topicId?: string;
}

export interface MessageContent {
  type: MessageContentType;
  text?: string;
  docId?: string;
  docTitle?: string;
  pageCount?: number;
  buttons?: { label: string; action: string }[];
  crmFields?: { name: string; from: string; to?: string; col3?: string }[];
  email?: { to: string; cc?: string; subject: string; body: string };
  quote?: { speaker: string; text: string };
  statusIcon?: "loading" | "success" | "error";
  meetings?: MeetingListItem[];
  alertLevel?: "info" | "warning" | "critical";
  overdueTasks?: OverdueTask[];
  insightItems?: InsightBrief[];
  playbookRule?: { id: string; description: string; trigger: string };
}

export interface ChatMessage {
  id: string;
  topicId: TopicId | "global";
  role: "user" | "shadow";
  content: MessageContent[];
  createdAt: string;
}

export const chatMessages: ChatMessage[] = [];

export const getMessagesByTopic = (
  topicId: TopicId | "global"
): ChatMessage[] =>
  chatMessages.filter((m) => m.topicId === topicId);

export interface ChatSession {
  date: string;
  label: string;
  messages: ChatMessage[];
}

export function groupMessagesBySessions(
  messages: ChatMessage[]
): ChatSession[] {
  const groups: Record<string, ChatMessage[]> = {};

  for (const msg of messages) {
    const date = msg.createdAt.slice(0, 10);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  }

  const today = "2026-02-24";
  const yesterday = "2026-02-23";

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, msgs]) => ({
      date,
      label:
        date === today
          ? "Today"
          : date === yesterday
            ? "Yesterday"
            : new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
      messages: msgs.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    }));
}
