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
  | "overdue_followups";

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
  overdueTasks?: OverdueTask[];
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
          {
            eventId: "m1",
            title: "TechVision 需求访谈",
            time: "10:00 — 11:00",
            topicId: "techvision",
            status: "ready",
            statusText: "Agenda 和客户 research 已就绪",
            prepDocs: [
              { docId: "doc-agenda-techvision", docTitle: "需求访谈 Agenda" },
              { docId: "doc-meeting-notes-techvision", docTitle: "客户背景 Research" },
            ],
          },
          {
            eventId: "m2",
            title: "RetailMax 营销策略工作坊",
            time: "14:00 — 15:30",
            topicId: "retailmax",
            status: "ready",
            statusText: "Agenda 和策略文档已准备好",
            prepDocs: [
              { docId: "doc-agenda-retailmax", docTitle: "工作坊 Agenda" },
              { docId: "doc-strategy-retailmax", docTitle: "营销策略文档" },
            ],
          },
          {
            eventId: "m3",
            title: "CloudFlow 续约沟通",
            time: "明天 14:00",
            topicId: "cloudflow",
            status: "upcoming",
            statusText: "续约材料正在准备",
            prepDocs: [
              { docId: "doc-report-cloudflow", docTitle: "CloudFlow 周报" },
            ],
          },
        ],
      },
      {
        type: "overdue_followups",
        alertLevel: "warning",
        text: "CloudFlow 有 2 个逾期 follow-up 需要关注：",
        overdueTasks: [
          { id: "od-1", label: "发送续约提案给客户", topicId: "cloudflow", daysOverdue: 3, action: "send_proposal" },
          { id: "od-2", label: "更新 CRM 续约状态", topicId: "cloudflow", daysOverdue: 2, action: "update_crm" },
        ],
      },
    ],
    createdAt: "2026-02-24T09:00:30",
  },

  // TechVision conversation — pre-meeting prep
  {
    id: "tv-1",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "TechVision 需求访谈将在今天 10:00 开始。我已完成会前准备：",
      },
      { type: "status_update", text: "客户背景调研已完成", statusIcon: "success" },
      { type: "status_update", text: "Agenda 已生成", statusIcon: "success" },
      { type: "status_update", text: "CRM 历史记录已整理", statusIcon: "success" },
    ],
    createdAt: "2026-02-24T08:30:00",
  },
  {
    id: "tv-2",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "以下是会前材料，请在会议前 review：",
      },
      {
        type: "doc_card",
        docId: "doc-agenda-techvision",
        docTitle: "TechVision 需求访谈 - Agenda",
      },
      {
        type: "doc_card",
        docId: "doc-meeting-notes-techvision",
        docTitle: "TechVision 客户背景 Research",
      },
    ],
    createdAt: "2026-02-24T08:31:00",
  },
  {
    id: "tv-3",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "根据上次沟通记录，Tom 特别提到了 AI 差异化定位。建议今天重点讨论以下话题：",
      },
      {
        type: "transcript_quote",
        quote: {
          speaker: "Tom (上次沟通)",
          text: "我们需要一份新的产品定位 deck，下周三董事会前给到，重点突出 AI 功能的差异化。",
        },
      },
      {
        type: "text",
        text: "建议的讨论重点：\n1. AI 功能差异化核心卖点\n2. 董事会融资节奏期望\n3. 竞品分析需求",
      },
    ],
    createdAt: "2026-02-24T08:32:00",
  },
  {
    id: "tv-4",
    topicId: "techvision",
    role: "user",
    content: [{ type: "text", text: "好的，我看一下 Agenda" }],
    createdAt: "2026-02-24T09:00:00",
  },
  {
    id: "tv-5",
    topicId: "techvision",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "还有一件事 — Lisa 上周发了一封邮件提到会员运营数据，我已整合到 Agenda 第 3 节。如果需要调整，可以在这里告诉我。",
      },
      {
        type: "action_buttons",
        buttons: [
          { label: "Agenda 没问题", action: "confirm_agenda" },
          { label: "我要调整", action: "edit_agenda" },
        ],
      },
    ],
    createdAt: "2026-02-24T09:01:00",
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

  // Fundraising 2026 conversation
  {
    id: "fr-1",
    topicId: "fundraising",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "Fundraising 2026 进展更新：我已整理好近期投资人沟通的关键信息。",
      },
      { type: "status_update", text: "Pitch Deck 草稿已生成 (12 页)", statusIcon: "success" },
      { type: "status_update", text: "Financial Model 已更新至 Q1 数据", statusIcon: "success" },
      { type: "status_update", text: "投资人名单已筛选 — 8 家目标机构", statusIcon: "success" },
    ],
    createdAt: "2026-02-24T07:30:00",
  },
  {
    id: "fr-2",
    topicId: "fundraising",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "以下材料供你 review，路演彩排安排在 2/26：",
      },
      {
        type: "doc_card",
        docId: "doc-pitch-deck",
        docTitle: "Fundraising 2026 - Pitch Deck (Draft)",
        pageCount: 12,
      },
      {
        type: "doc_card",
        docId: "doc-financial-model",
        docTitle: "Financial Model - 2026 Q1 Update",
      },
    ],
    createdAt: "2026-02-24T07:31:00",
  },
  {
    id: "fr-3",
    topicId: "fundraising",
    role: "user",
    content: [{ type: "text", text: "Pitch Deck 里面有包含竞品对比吗？" }],
    createdAt: "2026-02-24T08:10:00",
  },
  {
    id: "fr-4",
    topicId: "fundraising",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "有的，在第 7 页「竞争格局」中包含了与 3 家主要竞品的对比分析。数据来源是最近的 AI Positioning 研究。如果需要补充更多维度，我可以更新。",
      },
      {
        type: "action_buttons",
        buttons: [
          { label: "内容没问题", action: "confirm_pitch" },
          { label: "补充更多竞品数据", action: "add_competitor" },
        ],
      },
    ],
    createdAt: "2026-02-24T08:11:00",
  },

  // Fundraising older messages
  {
    id: "fr-old-1",
    topicId: "fundraising",
    role: "user",
    content: [{ type: "text", text: "融资的目标金额确定了吗？" }],
    createdAt: "2026-02-18T14:00:00",
  },
  {
    id: "fr-old-2",
    topicId: "fundraising",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "根据 Financial Model，建议 A 轮融资目标为 $5M-$8M，主要用于产品研发和市场拓展。董事会已初步同意这个范围。",
      },
    ],
    createdAt: "2026-02-18T14:01:00",
  },

  // AI Positioning conversation
  {
    id: "ap-1",
    topicId: "ai-positioning",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "AI Positioning 最新进展：市场分析报告已完成，竞品调研数据已更新。",
      },
      { type: "status_update", text: "市场分析报告已生成", statusIcon: "success" },
      { type: "status_update", text: "竞品功能对比矩阵已更新", statusIcon: "success" },
    ],
    createdAt: "2026-02-24T07:45:00",
  },
  {
    id: "ap-2",
    topicId: "ai-positioning",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "以下是 AI 定位相关材料，2/27 的策略研讨会会用到：",
      },
      {
        type: "doc_card",
        docId: "doc-market-analysis",
        docTitle: "AI 市场分析报告 - 2026",
      },
      {
        type: "doc_card",
        docId: "doc-ai-positioning-strategy",
        docTitle: "AI 差异化定位策略",
      },
    ],
    createdAt: "2026-02-24T07:46:00",
  },
  {
    id: "ap-3",
    topicId: "ai-positioning",
    role: "user",
    content: [{ type: "text", text: "竞品方面主要关注哪几家？" }],
    createdAt: "2026-02-24T08:20:00",
  },
  {
    id: "ap-4",
    topicId: "ai-positioning",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "目前重点跟踪 3 家：\n\n1. **AlphaAI** — 企业级 AI 平台，融资领先但产品通用性强\n2. **NeuralEdge** — 垂直行业 AI，与我们客群有重叠\n3. **DataMind** — 数据分析起家，正在向 AI 转型\n\n我们的差异化优势主要在「行业知识图谱」和「端到端自动化」两个方向。",
      },
    ],
    createdAt: "2026-02-24T08:21:00",
  },

  // AI Positioning older messages
  {
    id: "ap-old-1",
    topicId: "ai-positioning",
    role: "shadow",
    content: [
      {
        type: "text",
        text: "已收集到最新的 AI 行业报告，正在整理核心洞察。预计本周内完成市场分析初稿。",
      },
    ],
    createdAt: "2026-02-19T10:00:00",
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
