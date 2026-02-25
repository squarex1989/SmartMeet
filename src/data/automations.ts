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
  ruleDetail?: string;
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
    ruleDetail: "当会议结束后，自动从录音/笔记中提取关键信息，按照标准纪要模板生成草稿，包含：会议主题、参与人、讨论要点、决策事项、行动项及负责人。生成后放入待 review 队列。",
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
    ruleDetail: "每次会议结束后，分析会议内容中涉及的客户信息变更（联系人、需求、阶段等），自动生成 CRM 字段更新建议，需用户确认后执行。",
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
    ruleDetail: "会议结束后自动分析讨论内容，识别所有待办事项和行动项，包括负责人和截止日期，自动添加到对应 topic 的 follow-up 列表中。",
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
    ruleDetail: "每周五下午 5 点自动汇总本周所有 topic 的会议记录、完成的任务、未完成的 follow-up，生成结构化的周报草稿，放入待 review 队列。",
  },
  {
    id: "auto-global-doc",
    description: "按照《Sarah 的工作准则》中的要求执行所有工作",
    trigger: "always",
    actions: ["遵循文档中的工作规范和流程要求"],
    requiresReview: false,
    enabled: true,
    scope: "global",
    ruleDetail: "在执行所有工作任务时，遵循《Sarah 的工作准则》文档中定义的规范，包括沟通风格、汇报格式、优先级判断标准和质量要求。",
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
    ruleDetail: "TechVision 相关会议结束后，将纪要生成任务标记为高优先级，确保在 30 分钟内完成初稿并推送至待 review 队列。",
  },
  {
    id: "auto-6",
    description: "TechVision 融资内容脱敏",
    trigger: "meeting_ended",
    actions: ["纪要中融资相关内容做脱敏处理"],
    requiresReview: false,
    enabled: true,
    scope: "techvision",
    ruleDetail: "在生成 TechVision 相关的会议纪要和文档时，自动识别并脱敏融资金额、估值、投资人信息等敏感内容，替换为通用占位符。",
  },
  {
    id: "auto-tv-data",
    description: "汇报内容以量化数据为主",
    trigger: "report_generation",
    actions: ["汇报中优先使用量化指标和数据图表"],
    requiresReview: false,
    enabled: true,
    scope: "techvision",
    ruleDetail: "为 TechVision 生成的所有汇报类文档，优先使用量化数据和指标呈现，包括 KPI 完成率、同比/环比数据、转化率等，符合 Tom 对数据驱动汇报的偏好。",
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
    ruleDetail: "为 RetailMax 撰写邮件时，使用温暖且重视对方的语气，体现对合作关系的珍视，避免过于正式或冷淡的措辞。",
  },
  {
    id: "auto-rm-weekly",
    description: "每周三生成周中进展汇报",
    trigger: "schedule:weekly:wed:10:00",
    actions: ["汇总本周 RetailMax 进展", "生成周中汇报草稿"],
    requiresReview: true,
    enabled: true,
    scope: "retailmax",
    ruleDetail: "每周三上午 10:00 自动汇总 RetailMax 本周已完成的工作、进行中的事项和待处理的问题，生成一份结构化的周中进展汇报草稿。",
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
    ruleDetail: "为 CloudFlow 撰写邮件时，保持专业严谨的语气，使用精确的数据和技术术语，体现对技术合作的专业性。",
  },
  {
    id: "auto-cf-decision",
    description: "续约邮件附带上次沟通关键决策点",
    trigger: "email_draft",
    actions: ["在续约邮件中自动附带上次沟通的关键决策点"],
    requiresReview: false,
    enabled: true,
    scope: "cloudflow",
    ruleDetail: "在撰写 CloudFlow 续约相关的沟通邮件时，自动检索并附带上一次沟通中记录的关键决策点和共识内容，确保沟通连贯性。",
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
