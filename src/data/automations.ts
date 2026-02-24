import type { TopicId } from "./topics";

export interface Automation {
  id: string;
  description: string;
  trigger: string;
  actions: string[];
  requiresReview: boolean;
  enabled: boolean;
  scope: "global" | TopicId;
  lastTriggered?: string;
}

export const automations: Automation[] = [
  // Global rules
  {
    id: "auto-1",
    description: "会后自动生成会议纪要",
    trigger: "meeting_ended",
    actions: ["生成纪要草稿"],
    requiresReview: true,
    enabled: true,
    scope: "global",
    lastTriggered: "2026-02-24T10:32:00",
  },
  {
    id: "auto-2",
    description: "会后建议 CRM 更新",
    trigger: "meeting_ended",
    actions: ["生成 CRM 更新建议"],
    requiresReview: true,
    enabled: true,
    scope: "global",
    lastTriggered: "2026-02-24T10:33:00",
  },
  {
    id: "auto-3",
    description: "会后提取 Follow-up 任务",
    trigger: "meeting_ended",
    actions: ["识别并提取行动项"],
    requiresReview: false,
    enabled: true,
    scope: "global",
    lastTriggered: "2026-02-24T10:34:00",
  },
  {
    id: "auto-4",
    description: "每周五 17:00 生成周报",
    trigger: "schedule:weekly:fri:17:00",
    actions: ["汇总本周会议和任务", "生成周报草稿"],
    requiresReview: true,
    enabled: true,
    scope: "global",
    lastTriggered: "2026-02-21T17:00:00",
  },
  // TechVision overrides
  {
    id: "auto-5",
    description: "TechVision 纪要 30 分钟内交付",
    trigger: "meeting_ended",
    actions: ["优先处理，30 分钟内生成纪要"],
    requiresReview: true,
    enabled: true,
    scope: "techvision",
    lastTriggered: "2026-02-24T10:32:00",
  },
  {
    id: "auto-6",
    description: "TechVision 融资内容脱敏",
    trigger: "meeting_ended",
    actions: ["纪要中融资相关内容做脱敏处理"],
    requiresReview: false,
    enabled: true,
    scope: "techvision",
  },
  // RetailMax overrides
  {
    id: "auto-7",
    description: "RetailMax 邮件风格：温暖、重视感",
    trigger: "email_draft",
    actions: ["使用温暖重视的邮件语气"],
    requiresReview: false,
    enabled: true,
    scope: "retailmax",
  },
  // CloudFlow overrides
  {
    id: "auto-8",
    description: "CloudFlow 邮件风格：专业严谨",
    trigger: "email_draft",
    actions: ["使用专业严谨的邮件语气"],
    requiresReview: false,
    enabled: true,
    scope: "cloudflow",
  },
];

export const getGlobalAutomations = (): Automation[] =>
  automations.filter((a) => a.scope === "global");

export const getAutomationsByTopic = (topicId: TopicId): Automation[] =>
  automations.filter((a) => a.scope === topicId);

export const getAutomationsForContext = (
  context: "all" | TopicId
): Automation[] => {
  if (context === "all") return automations;
  return automations.filter(
    (a) => a.scope === "global" || a.scope === context
  );
};
