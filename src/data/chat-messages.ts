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
  | "alert_card";

export interface MeetingListItem {
  eventId: string;
  title: string;
  time: string;
  topicId: string;
  status: "ready" | "preparing" | "upcoming";
  statusText: string;
}

export interface MessageContent {
  type: MessageContentType;
  text?: string;
  docId?: string;
  docTitle?: string;
  pageCount?: number;
  buttons?: { label: string; action: string }[];
  crmFields?: { name: string; from: string; to: string }[];
  email?: { to: string; cc?: string; subject: string; body: string };
  quote?: { speaker: string; text: string };
  statusIcon?: "loading" | "success" | "error";
  meetings?: MeetingListItem[];
  alertLevel?: "info" | "warning" | "critical";
}

export interface ChatMessage {
  id: string;
  topicId: TopicId | "global";
  role: "user" | "shadow";
  content: MessageContent[];
  createdAt: string;
}

export const chatMessages: ChatMessage[] = [
  // Global conversation
  {
    id: "gm-1",
    topicId: "global",
    role: "user",
    content: [{ type: "text", text: "今天有什么需要我处理的？" }],
    createdAt: "2026-02-24T09:00:00",
  },
  {
    id: "gm-2",
    topicId: "global",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "早上好 Sarah，今天有 2 场会议，明天有 1 场：",
      },
      {
        type: "meeting_list",
        meetings: [
          { eventId: "m1", title: "TechVision 需求访谈", time: "10:00 — 11:00", topicId: "techvision", status: "ready", statusText: "Agenda 和客户 research 已就绪" },
          { eventId: "m2", title: "RetailMax 营销策略工作坊", time: "14:00 — 15:30", topicId: "retailmax", status: "ready", statusText: "Agenda 和策略文档已准备好" },
          { eventId: "m3", title: "CloudFlow 续约沟通", time: "明天 14:00", topicId: "cloudflow", status: "upcoming", statusText: "续约材料正在准备" },
        ],
      },
      {
        type: "alert_card",
        alertLevel: "warning",
        text: "CloudFlow 有 2 个逾期 follow-up 需要关注，建议优先处理。",
      },
    ],
    createdAt: "2026-02-24T09:00:30",
  },

  // TechVision conversation
  {
    id: "tv-1",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "TechVision 需求访谈已结束。我正在处理会后任务...",
      },
      { type: "status_update", text: "正在分析会议 transcript...", statusIcon: "success" },
      { type: "status_update", text: "识别到 4 个 follow-up 任务", statusIcon: "success" },
      { type: "status_update", text: "会议纪要已生成", statusIcon: "success" },
    ],
    createdAt: "2026-02-24T10:32:00",
  },
  {
    id: "tv-2",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "会议纪要已经准备好了，请 review：",
      },
      {
        type: "doc_card",
        docId: "doc-meeting-notes-techvision",
        docTitle: "TechVision 需求访谈纪要 - 2026.02.24",
      },
    ],
    createdAt: "2026-02-24T10:33:00",
  },
  {
    id: "tv-3",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "CRM 记录需要更新几个字段：",
      },
      {
        type: "crm_preview",
        crmFields: [
          { name: "客户阶段", from: "需求调研中", to: "方案制定中" },
          { name: "关键联系人", from: "Tom (CTO)", to: "Tom (CTO), Lisa (CMO)" },
          { name: "最近沟通", from: "2026-02-05", to: "2026-02-24" },
        ],
      },
      {
        type: "action_buttons",
        buttons: [
          { label: "确认更新", action: "confirm_crm" },
          { label: "需要修改", action: "edit_crm" },
        ],
      },
    ],
    createdAt: "2026-02-24T10:34:00",
  },
  {
    id: "tv-4",
    topicId: "techvision",
    role: "user",
    content: [{ type: "text", text: "确认更新 CRM" }],
    createdAt: "2026-02-24T10:35:00",
  },
  {
    id: "tv-5",
    topicId: "techvision",
    role: "shadow",
    content: [
      { type: "status_update", text: "CRM 已更新 ✓", statusIcon: "success" },
      {
        type: "text",
        text: "Tom 提到需要一份产品定位 Deck，要我生成初稿吗？",
      },
      {
        type: "transcript_quote",
        quote: {
          speaker: "Tom",
          text: "我们需要一份新的产品定位 deck，下周三董事会前给到，重点突出 AI 功能的差异化。",
        },
      },
      {
        type: "action_buttons",
        buttons: [
          { label: "帮我生成", action: "generate_slides" },
          { label: "先不用", action: "skip_slides" },
        ],
      },
    ],
    createdAt: "2026-02-24T10:35:30",
  },
  {
    id: "tv-6",
    topicId: "techvision",
    role: "user",
    content: [{ type: "text", text: "帮我生成" }],
    createdAt: "2026-02-24T10:36:00",
  },
  {
    id: "tv-7",
    topicId: "techvision",
    role: "shadow",
    content: [
      { type: "status_update", text: "正在生成产品定位 Deck...", statusIcon: "loading" },
    ],
    createdAt: "2026-02-24T10:36:30",
  },
  {
    id: "tv-8",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "产品定位 Slides 初稿已完成，共 8 页。",
      },
      {
        type: "doc_card",
        docId: "doc-slides-techvision",
        docTitle: "TechVision 产品定位 Deck (Draft)",
        pageCount: 8,
      },
    ],
    createdAt: "2026-02-24T10:38:00",
  },

  // Older TechVision messages (previous session)
  {
    id: "tv-old-1",
    topicId: "techvision",
    role: "user",
    content: [{ type: "text", text: "TechVision 下周的融资路演材料准备得怎么样了？" }],
    createdAt: "2026-02-20T15:00:00",
  },
  {
    id: "tv-old-2",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "正在整理中。目前已收集到 Q4 Board Deck、历史访谈纪要和 CRM 数据。预计明天可以出初稿。",
      },
    ],
    createdAt: "2026-02-20T15:01:00",
  },

  // CloudFlow conversation
  {
    id: "cf-1",
    topicId: "cloudflow",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "CloudFlow 周报草稿已生成，涵盖上周续约进展和本周计划。",
      },
      {
        type: "doc_card",
        docId: "doc-report-cloudflow",
        docTitle: "CloudFlow 周报 - 2026.02.24",
      },
      {
        type: "action_buttons",
        buttons: [
          { label: "查看周报", action: "view_report" },
          { label: "直接发送给客户", action: "send_report" },
        ],
      },
    ],
    createdAt: "2026-02-24T08:00:00",
  },

  // RetailMax conversation
  {
    id: "rm-1",
    topicId: "retailmax",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "RetailMax 营销策略工作坊将在今天 14:00 开始。以下材料已准备就绪：",
      },
      {
        type: "doc_card",
        docId: "doc-agenda-retailmax",
        docTitle: "RetailMax 营销策略工作坊 - Agenda",
      },
      {
        type: "doc_card",
        docId: "doc-strategy-retailmax",
        docTitle: "RetailMax 营销策略文档",
      },
      {
        type: "text",
        text: "已从上次会议记录中提取了 CMO Lisa 的核心关注点，融入了 Agenda 第 2 节。",
      },
    ],
    createdAt: "2026-02-24T09:15:00",
  },
];

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
