import type { AdvisorId } from "./advisors";

export type MeetingId = string;

export interface CalendarEvent {
  id: MeetingId;
  title: string;
  start: string; // ISO
  end: string;
  advisorId: AdvisorId;
  type: "client" | "internal" | "follow-up";
  isPast: boolean;
  // For future meetings
  prep?: MeetingPrep;
  // For past meetings
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

// Demo: week of 2026-02-09
const baseDate = "2026-02-09";

export const calendarEvents: CalendarEvent[] = [
  {
    id: "m1",
    title: "TechVision 需求访谈",
    start: `${baseDate}T10:00:00`,
    end: `${baseDate}T11:00:00`,
    advisorId: "alex",
    type: "client",
    isPast: true,
    outcome: {
      summaryDocId: "doc-meeting-notes-techvision",
      crmUpdated: true,
      emailSent: { to: "Tom, Lisa", subject: "TechVision 需求访谈 - 纪要与下一步" },
      followUpTasks: [
        { id: "f1", label: "会议纪要", status: "done", linkDocId: "doc-meeting-notes-techvision" },
        { id: "f2", label: "CRM 更新", status: "done" },
        { id: "f3", label: "产品定位 Slides", status: "done", linkDocId: "doc-slides-techvision" },
        { id: "f4", label: "Proposal 定价更新", status: "done" },
        { id: "f5", label: "Follow-up Call", status: "done", linkCalendar: "下周二 14:00" },
        { id: "f6", label: "竞品分析邮件", status: "done" },
      ],
    },
  },
  {
    id: "m2",
    title: "RetailMax 营销策略工作坊",
    start: `${baseDate}T14:00:00`,
    end: `${baseDate}T15:30:00`,
    advisorId: "jamie",
    type: "client",
    isPast: false,
    prep: {
      agendaDocId: "doc-agenda-retailmax",
      clientSummary: "RetailMax 是主打年轻群体的零售品牌，近期希望提升全渠道转化与会员复购。关键联系人：CMO Lisa、电商负责人 David。",
      recommendedQuestions: [
        { question: "Q3 的 KPI 目前完成度如何？", reason: "了解当前进度，便于制定策略优先级" },
        { question: "用户画像最近有没有更新？", reason: "确保策略与最新用户洞察对齐" },
      ],
      openingScript: "大家好，今天我们把 Q3 的营销策略和落地节奏过一遍，重点看全渠道协同和会员运营两块……",
    },
  },
  {
    id: "m3",
    title: "CloudFlow 续约沟通",
    start: `${baseDate}T16:00:00`,
    end: `${baseDate}T16:45:00`,
    advisorId: "morgan",
    type: "client",
    isPast: false,
    prep: {
      clientSummary: "CloudFlow 企业版即将续约，客户成功团队希望我们协助梳理价值与案例。",
      recommendedQuestions: [
        { question: "续约决策时间线是？", reason: "便于安排材料与沟通节奏" },
      ],
      openingScript: "Hi，今天主要想跟您同步一下本期的成果，并听听续约方面的计划……",
    },
  },
];

export type EventStatus = "past" | "ongoing" | "upcoming";

/** Derive status from event times. Pass optional now (ISO string) for demo/testing. */
export function getEventStatus(
  event: CalendarEvent,
  nowStr?: string
): EventStatus {
  const now = nowStr ? new Date(nowStr).getTime() : Date.now();
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
