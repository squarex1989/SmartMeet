import type { TopicId } from "./topics";

export type MeetingId = string;

export interface CalendarEvent {
  id: MeetingId;
  title: string;
  start: string;
  end: string;
  topicId: TopicId;
  type: "client" | "internal" | "follow-up";
  isPast: boolean;
  prep?: MeetingPrep;
  outcome?: MeetingOutcome;
}

export interface MeetingPrep {
  agendaDocId?: string;
  clientSummary: string;
  recommendedQuestions: { question: string; reason?: string }[];
  openingScript: string;
}

export interface MeetingOutcome {
  summaryDocId?: string;
  crmUpdated: boolean;
  emailSent?: { to: string; subject: string };
  followUpTasks: FollowUpTaskStatus[];
}

export interface FollowUpTaskStatus {
  id: string;
  label: string;
  status: "done" | "pending_review" | "in_progress";
  linkDocId?: string;
  linkCalendar?: string;
}

const baseDate = "2026-02-24";
export const DEMO_NOW = `${baseDate}T09:30:00`;

export const calendarEvents: CalendarEvent[] = [
  {
    id: "m1",
    title: "TechVision 需求访谈",
    start: `${baseDate}T10:00:00`,
    end: `${baseDate}T11:00:00`,
    topicId: "techvision",
    type: "client",
    isPast: false,
    prep: {
      agendaDocId: "doc-agenda-techvision",
      clientSummary:
        "TechVision 是 AI 驱动的科技创业公司，近期聚焦产品定位与融资路演。关键联系人：CTO Tom、CMO Lisa。本次访谈重点了解产品需求与差异化策略。",
      recommendedQuestions: [
        { question: "AI 功能差异化的核心卖点是什么？", reason: "明确产品定位方向" },
        { question: "董事会对融资节奏有什么期望？", reason: "了解时间线以便安排后续" },
        { question: "竞品方面最关注哪些对手？", reason: "为竞品分析做准备" },
      ],
      openingScript:
        "Hi Tom, Lisa，今天主要想深入了解一下产品需求和差异化策略，为后续 Proposal 和定位材料做好准备……",
    },
  },
  {
    id: "m2",
    title: "RetailMax 营销策略工作坊",
    start: `${baseDate}T14:00:00`,
    end: `${baseDate}T15:30:00`,
    topicId: "retailmax",
    type: "client",
    isPast: false,
    prep: {
      agendaDocId: "doc-agenda-retailmax",
      clientSummary:
        "RetailMax 是主打年轻群体的零售品牌，近期希望提升全渠道转化与会员复购。关键联系人：CMO Lisa、电商负责人 David。",
      recommendedQuestions: [
        { question: "Q3 的 KPI 目前完成度如何？", reason: "了解当前进度，便于制定策略优先级" },
        { question: "用户画像最近有没有更新？", reason: "确保策略与最新用户洞察对齐" },
      ],
      openingScript:
        "大家好，今天我们把 Q3 的营销策略和落地节奏过一遍，重点看全渠道协同和会员运营两块……",
    },
  },
  {
    id: "m3",
    title: "CloudFlow 续约沟通",
    start: "2026-02-25T14:00:00",
    end: "2026-02-25T14:45:00",
    topicId: "cloudflow",
    type: "client",
    isPast: false,
    prep: {
      clientSummary:
        "CloudFlow 企业版即将续约，客户成功团队希望我们协助梳理价值与案例。",
      recommendedQuestions: [
        { question: "续约决策时间线是？", reason: "便于安排材料与沟通节奏" },
      ],
      openingScript:
        "Hi，今天主要想跟您同步一下本期的成果，并听听续约方面的计划……",
    },
  },
  {
    id: "m4",
    title: "投资人路演彩排",
    start: "2026-02-26T10:00:00",
    end: "2026-02-26T11:30:00",
    topicId: "fundraising",
    type: "internal",
    isPast: false,
    prep: {
      agendaDocId: "doc-pitch-deck",
      clientSummary:
        "内部路演彩排，模拟投资人 Q&A 环节。重点打磨 Pitch Deck 中的市场机会和财务预测部分。",
      recommendedQuestions: [
        { question: "市场规模的数据来源是什么？", reason: "投资人必问，需要权威引用" },
        { question: "盈亏平衡预计在什么时候？", reason: "财务可持续性是关键关注点" },
        { question: "竞品融资情况如何？", reason: "对标竞品估值" },
      ],
      openingScript:
        "大家好，今天模拟正式路演流程，我先过一遍完整 Pitch，然后大家扮演投资人提问……",
    },
  },
  {
    id: "m5",
    title: "AI 定位策略研讨",
    start: "2026-02-27T14:00:00",
    end: "2026-02-27T15:30:00",
    topicId: "ai-positioning",
    type: "internal",
    isPast: false,
    prep: {
      agendaDocId: "doc-ai-positioning-strategy",
      clientSummary:
        "内部策略研讨会，讨论 AI 差异化定位方向。基于市场分析报告和竞品调研确定核心定位。",
      recommendedQuestions: [
        { question: "行业知识图谱的技术壁垒有多高？", reason: "评估差异化的可持续性" },
        { question: "端到端自动化的 MVP 范围是什么？", reason: "确定优先级和资源分配" },
      ],
      openingScript:
        "今天的重点是确定 AI 差异化定位策略。我们先回顾市场分析报告，然后讨论两个候选方向……",
    },
  },
];

export type EventStatus = "past" | "ongoing" | "upcoming";

export function getEventStatus(
  event: CalendarEvent,
  nowStr?: string
): EventStatus {
  if (event.isPast) return "past";
  const now = nowStr ? new Date(nowStr).getTime() : new Date(DEMO_NOW).getTime();
  const start = new Date(event.start).getTime();
  const end = new Date(event.end).getTime();
  if (now > end) return "past";
  if (now >= start && now <= end) return "ongoing";
  return "upcoming";
}

export const getEventsForDate = (dateStr: string): CalendarEvent[] =>
  calendarEvents.filter((e) => e.start.startsWith(dateStr.slice(0, 10)));

export const getEventById = (id: MeetingId): CalendarEvent | undefined =>
  calendarEvents.find((e) => e.id === id);

export const getEventsByTopic = (topicId: TopicId): CalendarEvent[] =>
  calendarEvents.filter((e) => e.topicId === topicId);
