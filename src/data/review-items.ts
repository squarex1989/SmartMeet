import type { TopicId } from "./topics";

export type ReviewStatus = "pending_review" | "done";

export type ReviewItemType =
  | "meeting_notes"
  | "crm_update"
  | "follow_up"
  | "weekly_report"
  | "email_draft"
  | "meeting_prep";

export function getActionLabel(type: ReviewItemType): string | null {
  switch (type) {
    case "email_draft": return "Send Email";
    case "crm_update": return "Update CRM";
    case "follow_up": return "Schedule";
    case "weekly_report": return "Send Report";
    case "meeting_notes": return null;
    case "meeting_prep": return null;
    default: return null;
  }
}

export interface CrmField {
  name: string;
  from: string;
  to: string;
}

export interface MeetingNotesPayload {
  type: "meeting_notes";
  docId: string;
  meetingTitle: string;
}

export interface CrmUpdatePayload {
  type: "crm_update";
  fields: CrmField[];
}

export interface EmailPayload {
  type: "email_draft";
  to: string;
  cc?: string;
  subject: string;
  body: string;
}

export interface FollowUpPayload {
  type: "follow_up";
  description: string;
  dueDate?: string;
}

export interface WeeklyReportPayload {
  type: "weekly_report";
  docId: string;
  period: string;
}

export type ReviewPayload =
  | MeetingNotesPayload
  | CrmUpdatePayload
  | EmailPayload
  | FollowUpPayload
  | WeeklyReportPayload;

export interface ReviewItem {
  id: string;
  topicId: TopicId;
  type: ReviewItemType;
  title: string;
  summary: string;
  status: ReviewStatus;
  createdAt: string;
  payload: ReviewPayload;
}

export const reviewItems: ReviewItem[] = [
  {
    id: "ri-1",
    topicId: "techvision",
    type: "meeting_notes",
    title: "TechVision 需求访谈纪要",
    summary: "包含 4 个行动项，需确认后发布",
    status: "pending_review",
    createdAt: "2026-02-24T10:45:00",
    payload: {
      type: "meeting_notes",
      docId: "doc-meeting-notes-techvision",
      meetingTitle: "TechVision 需求访谈",
    },
  },
  {
    id: "ri-2",
    topicId: "techvision",
    type: "crm_update",
    title: "TechVision CRM 更新建议",
    summary: "客户阶段、联系人、备注变更",
    status: "pending_review",
    createdAt: "2026-02-24T10:46:00",
    payload: {
      type: "crm_update",
      fields: [
        { name: "客户阶段", from: "需求调研中", to: "方案制定中" },
        { name: "关键联系人", from: "Tom (CTO)", to: "Tom (CTO), Lisa (CMO)" },
        { name: "最近沟通", from: "2026-02-05", to: "2026-02-24" },
        { name: "备注", from: "初步沟通已完成", to: "已完成需求访谈，进入策略制定阶段" },
      ],
    },
  },
  {
    id: "ri-3",
    topicId: "techvision",
    type: "email_draft",
    title: "竞品分析邮件草稿",
    summary: "发给 TechVision 技术团队的竞品对比数据",
    status: "pending_review",
    createdAt: "2026-02-24T10:50:00",
    payload: {
      type: "email_draft",
      to: "tech-team@techvision.com",
      cc: "tom@techvision.com",
      subject: "竞品分析数据 - 来自今天的需求访谈",
      body: "Hi Team,\n\n附件是我们今天讨论的竞品对比分析，供技术团队参考。如有问题随时联系。\n\nSarah",
    },
  },
  {
    id: "ri-4",
    topicId: "techvision",
    type: "follow_up",
    title: "安排 Follow-up Call",
    summary: "下周二 14:00 与 Tom、Lisa 确认最终方案",
    status: "pending_review",
    createdAt: "2026-02-24T10:48:00",
    payload: {
      type: "follow_up",
      description: "安排下周二 14:00-15:00 Follow-up Call，参会人 Tom、Lisa、Sarah",
      dueDate: "2026-03-03T14:00:00",
    },
  },
  {
    id: "ri-5",
    topicId: "cloudflow",
    type: "weekly_report",
    title: "CloudFlow 周报草稿",
    summary: "涵盖续约进展和本周计划",
    status: "pending_review",
    createdAt: "2026-02-24T08:00:00",
    payload: {
      type: "weekly_report",
      docId: "doc-report-cloudflow",
      period: "2026-02-17 ~ 2026-02-24",
    },
  },
  {
    id: "ri-6",
    topicId: "cloudflow",
    type: "email_draft",
    title: "CloudFlow 周报邮件",
    summary: "待确认发送给客户",
    status: "pending_review",
    createdAt: "2026-02-24T08:30:00",
    payload: {
      type: "email_draft",
      to: "contact@cloudflow.com",
      subject: "CloudFlow 周报 - 2026.02.24",
      body: "Hi Team,\n\n附件是本周的项目进展周报，请查收。\n\nSarah",
    },
  },
  {
    id: "ri-7",
    topicId: "retailmax",
    type: "meeting_prep",
    title: "RetailMax 工作坊准备材料",
    summary: "Agenda 和策略文档已就绪，会前 review 确认即可",
    status: "pending_review",
    createdAt: "2026-02-24T09:00:00",
    payload: {
      type: "meeting_notes",
      docId: "doc-agenda-retailmax",
      meetingTitle: "RetailMax 营销策略工作坊",
    },
  },
];

export const getReviewItemsByTopic = (topicId: TopicId): ReviewItem[] =>
  reviewItems.filter((r) => r.topicId === topicId);

export const getPendingReviewItems = (): ReviewItem[] =>
  reviewItems.filter((r) => r.status === "pending_review");

export const getReviewItemById = (id: string): ReviewItem | undefined =>
  reviewItems.find((r) => r.id === id);
