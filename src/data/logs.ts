import type { TopicId } from "./topics";

export type LogStatus = "processing" | "completed" | "waiting" | "auto_done";

export interface LogEntry {
  id: string;
  topicId: TopicId;
  timestamp: string;
  status: LogStatus;
  description: string;
  resourceType?: "doc" | "crm" | "email";
  resourceId?: string;
  resourcePreview?: string;
}

export const logEntries: LogEntry[] = [
  { id: "l1", topicId: "techvision", timestamp: "10:32", status: "completed", description: "分析会议 transcript", resourceType: "doc" },
  { id: "l2", topicId: "techvision", timestamp: "10:32", status: "completed", description: "识别到 4 个 follow-up 任务", resourceType: "doc" },
  { id: "l3", topicId: "techvision", timestamp: "10:33", status: "completed", description: "会议纪要已生成", resourceType: "doc", resourceId: "doc-meeting-notes-techvision", resourcePreview: "TechVision 需求访谈纪要" },
  { id: "l4", topicId: "techvision", timestamp: "10:33", status: "completed", description: "准备 CRM 更新内容", resourceType: "crm" },
  { id: "l5", topicId: "techvision", timestamp: "10:34", status: "waiting", description: "CRM 更新方案已就绪，等待确认", resourceType: "crm" },
  { id: "l6", topicId: "techvision", timestamp: "10:35", status: "completed", description: "产品定位 Slides 初稿已生成", resourceType: "doc", resourceId: "doc-slides-techvision", resourcePreview: "8 页" },
  { id: "l7", topicId: "techvision", timestamp: "10:36", status: "completed", description: "Proposal 修改建议已就绪", resourceType: "doc", resourceId: "doc-proposal-techvision" },
  { id: "l8", topicId: "techvision", timestamp: "10:36", status: "auto_done", description: "Follow-up Call 已添加到日历", resourcePreview: "下周二 14:00" },
  { id: "l9", topicId: "retailmax", timestamp: "09:15", status: "completed", description: "索引了 RetailMax 新文档", resourceType: "doc" },
  { id: "l10", topicId: "retailmax", timestamp: "09:30", status: "completed", description: "准备了营销策略工作坊 Agenda", resourceType: "doc", resourceId: "doc-agenda-retailmax" },
  { id: "l11", topicId: "cloudflow", timestamp: "08:00", status: "completed", description: "生成了 CloudFlow 周报草稿", resourceType: "doc", resourceId: "doc-report-cloudflow" },
  { id: "l12", topicId: "cloudflow", timestamp: "08:30", status: "waiting", description: "周报邮件待确认发送", resourceType: "email" },
];

export const getLogsByTopic = (topicId: TopicId): LogEntry[] =>
  logEntries.filter((l) => l.topicId === topicId);

export const getAllLogs = (): LogEntry[] =>
  [...logEntries].sort((a, b) => {
    const t = (x: LogEntry) => x.timestamp.replace(":", "");
    return parseInt(t(b), 10) - parseInt(t(a), 10);
  });
