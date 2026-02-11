import type { AssistantId } from "./assistants";

export type LogStatus = "processing" | "completed" | "waiting" | "auto_done";

export interface LogEntry {
  id: string;
  assistantId: AssistantId;
  timestamp: string; // "10:32"
  status: LogStatus;
  description: string;
  resourceType?: "doc" | "crm" | "email";
  resourceId?: string;
  resourcePreview?: string;
}

// Alex's logs for post-meeting flow (shown in Chat right panel when in Alex 1:1)
export const alexLogs: LogEntry[] = [
  { id: "l1", assistantId: "alex", timestamp: "10:32", status: "completed", description: "正在分析会议 transcript...", resourceType: "doc" },
  { id: "l2", assistantId: "alex", timestamp: "10:32", status: "completed", description: "识别到 4 个 follow-up 任务", resourceType: "doc" },
  { id: "l3", assistantId: "alex", timestamp: "10:33", status: "completed", description: "会议纪要已生成", resourceType: "doc", resourceId: "doc-meeting-notes-techvision", resourcePreview: "TechVision 需求访谈纪要" },
  { id: "l4", assistantId: "alex", timestamp: "10:33", status: "completed", description: "正在准备 CRM 更新内容...", resourceType: "crm" },
  { id: "l5", assistantId: "alex", timestamp: "10:34", status: "waiting", description: "CRM 更新方案已就绪，等待确认", resourceType: "crm", resourcePreview: "客户阶段、联系人、备注" },
  { id: "l6", assistantId: "alex", timestamp: "10:34", status: "completed", description: "正在分析 Slides 需求...", resourceType: "doc" },
  { id: "l7", assistantId: "alex", timestamp: "10:35", status: "completed", description: "产品定位 Slides 初稿已生成", resourceType: "doc", resourceId: "doc-slides-techvision", resourcePreview: "8 页" },
  { id: "l8", assistantId: "alex", timestamp: "10:36", status: "completed", description: "Proposal 修改建议已就绪", resourceType: "doc", resourceId: "doc-proposal-techvision" },
  { id: "l9", assistantId: "alex", timestamp: "10:36", status: "auto_done", description: "Follow-up Call 已添加到日历", resourcePreview: "下周二 14:00" },
  { id: "l10", assistantId: "alex", timestamp: "10:37", status: "waiting", description: "邮件草稿已拟好，等待确认发送", resourceType: "email", resourcePreview: "竞品分析数据 - 技术团队" },
];

// Jamie's recent logs
export const jamieLogs: LogEntry[] = [
  { id: "j1", assistantId: "jamie", timestamp: "09:15", status: "completed", description: "索引了 RetailMax 新文档", resourceType: "doc" },
  { id: "j2", assistantId: "jamie", timestamp: "09:30", status: "completed", description: "准备了营销策略工作坊 Agenda", resourceType: "doc", resourceId: "doc-agenda-retailmax" },
  { id: "j3", assistantId: "jamie", timestamp: "10:00", status: "completed", description: "更新了 RetailMax 营销策略文档", resourceType: "doc", resourceId: "doc-strategy-retailmax" },
];

// Morgan's recent logs
export const morganLogs: LogEntry[] = [
  { id: "m1", assistantId: "morgan", timestamp: "08:00", status: "completed", description: "生成了 CloudFlow 周报草稿", resourceType: "doc", resourceId: "doc-report-cloudflow" },
  { id: "m2", assistantId: "morgan", timestamp: "08:30", status: "waiting", description: "周报邮件待确认发送", resourceType: "email", resourcePreview: "CloudFlow 周报 - 2026.02.10" },
  { id: "m3", assistantId: "morgan", timestamp: "09:00", status: "completed", description: "更新了 CRM 记录", resourceType: "crm", resourcePreview: "CloudFlow 续约进展" },
];

export const logsByAssistant: Record<AssistantId, LogEntry[]> = {
  alex: alexLogs,
  jamie: jamieLogs,
  morgan: morganLogs,
};

// All logs mixed for group chat view (by time desc)
export const allLogsMixed: LogEntry[] = [
  ...alexLogs,
  ...jamieLogs,
  ...morganLogs,
].sort((a, b) => {
  const t = (x: LogEntry) => x.timestamp.replace(":", "");
  return parseInt(t(b), 10) - parseInt(t(a), 10);
});
