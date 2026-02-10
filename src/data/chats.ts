import type { AdvisorId } from "./advisors";

export type ConversationId = "group" | AdvisorId;

export type MessageRole = "user" | "advisor";

export type MessageContentType =
  | "text"
  | "doc_card"
  | "action_buttons"
  | "preview_panel"
  | "transcript_quote";

export interface MessageContent {
  type: MessageContentType;
  text?: string;
  docId?: string;
  docTitle?: string;
  pageCount?: number;
  buttons?: { label: string; action: string }[];
  preview?: Record<string, unknown>; // CRM diff, email draft, etc.
  quote?: { speaker: string; text: string };
}

export interface ChatMessage {
  id: string;
  conversationId: ConversationId;
  role: MessageRole;
  advisorId?: AdvisorId;
  content: MessageContent[];
  createdAt: string;
  // For scripted flow: next step triggered by button click
  nextOnAction?: Record<string, string>; // action id -> next message id or "advance"
}

// Group chat: "大家把本周进展发一下"
export const groupChatMessages: ChatMessage[] = [
  {
    id: "g1",
    conversationId: "group",
    role: "user",
    content: [{ type: "text", text: "大家把本周进展发一下" }],
    createdAt: "2026-02-11T09:00:00",
  },
  {
    id: "g2",
    conversationId: "group",
    role: "advisor",
    advisorId: "alex",
    content: [{ type: "text", text: "TechVision 这边需求访谈已完成，纪要已发，Slides 初稿和 Proposal 更新都做好了，等 Sarah 确认。" }],
    createdAt: "2026-02-11T09:01:00",
  },
  {
    id: "g3",
    conversationId: "group",
    role: "advisor",
    advisorId: "jamie",
    content: [{ type: "text", text: "RetailMax 营销策略工作坊的 Agenda 和客户摘要已准备好，下午会议可直接用。" }],
    createdAt: "2026-02-11T09:02:00",
  },
  {
    id: "g4",
    conversationId: "group",
    role: "advisor",
    advisorId: "morgan",
    content: [{ type: "text", text: "CloudFlow 周报草稿已生成，在 Doc 里，需要 Sarah 过目后发客户。" }],
    createdAt: "2026-02-11T09:03:00",
  },
];

// Jamie 1:1 - Sarah asks about CMO pain point
export const jamieChatMessages: ChatMessage[] = [
  {
    id: "j1",
    conversationId: "jamie",
    role: "user",
    content: [{ type: "text", text: "上次客户 CMO 说的那个关键痛点是什么？" }],
    createdAt: "2026-02-10T15:00:00",
  },
  {
    id: "j2",
    conversationId: "jamie",
    role: "advisor",
    advisorId: "jamie",
    content: [
      { type: "text", text: "RetailMax 的 CMO Lisa 在上次工作坊里提到，他们最大的痛点是" },
      { type: "transcript_quote", quote: { speaker: "Lisa", text: "全渠道数据分散，很难有一张统一的用户视图来做决策。" } },
      { type: "text", text: "所以她们希望我们先从会员和电商数据打通开始，再谈投放优化。" },
    ],
    createdAt: "2026-02-10T15:01:00",
  },
];

// Morgan 1:1 - Morgan sends weekly report
export const morganChatMessages: ChatMessage[] = [
  {
    id: "mo1",
    conversationId: "morgan",
    role: "advisor",
    advisorId: "morgan",
    content: [
      { type: "text", text: "CloudFlow 的周报草稿已经准备好了，请查收。" },
      { type: "doc_card", docId: "doc-report-cloudflow", docTitle: "CloudFlow 周报 - 2026.02.10" },
      { type: "action_buttons", buttons: [{ label: "查看周报", action: "view_doc" }, { label: "直接发送给客户", action: "send_report" }] },
    ],
    createdAt: "2026-02-10T08:00:00",
  },
];

// Alex 1:1 is driven by followups.ts script (post-meeting flow)
export const getMessagesForConversation = (convId: ConversationId): ChatMessage[] => {
  if (convId === "group") return groupChatMessages;
  if (convId === "jamie") return jamieChatMessages;
  if (convId === "morgan") return morganChatMessages;
  return []; // Alex messages come from followups script
};
