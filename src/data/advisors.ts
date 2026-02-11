export type AdvisorId = "alex" | "jamie" | "morgan";

export type KnowledgeIndexType = "doc" | "email" | "crm" | "meeting";

export interface KnowledgeIndexItem {
  name: string;
  summary: string;
  path: string;
  type: KnowledgeIndexType;
}

export interface Advisor {
  id: AdvisorId;
  name: string;
  tagline: string;
  avatar: string;
  color: string; // Tailwind class or hex for border
  client: string;
  clientIndustry: string;
  automationRules: AutomationRule[];
  recurringTasks: RecurringTask[];
  preferences: string[];
  indexedFilesCount: number;
  stats: { tasksCompletedThisWeek: number; meetingsProcessed: number };
  knowledgeIndex: KnowledgeIndexItem[];
}

export interface AutomationRule {
  id: string;
  description: string;
  trigger: string;
  actions: string[];
  requiresReview: boolean;
  enabled: boolean;
  details?: string;
}

export interface RecurringTask {
  id: string;
  description: string;
  schedule: string;
  dataSource?: string;
  outputLocation?: string;
}

export const advisors: Advisor[] = [
  {
    id: "alex",
    name: "Alex",
    tagline: "TechVision 的 AI 产品战略与融资路演",
    avatar: `https://ui-avatars.com/api/?name=Alex&background=E5684E&color=fff&size=128`,
    color: "#E5684E",
    client: "TechVision",
    clientIndustry: "科技创业公司",
    automationRules: [
      {
        id: "r1",
        description: "会后自动生成会议纪要 → 需 review",
        trigger: "会议结束",
        actions: ["生成纪要草稿"],
        requiresReview: true,
        enabled: true,
        details: "30 分钟内交付；融资相关内容脱敏",
      },
      {
        id: "r2",
        description: "会后更新 CRM",
        trigger: "会议结束",
        actions: ["更新客户阶段、联系人、备注"],
        requiresReview: true,
        enabled: true,
      },
      {
        id: "r3",
        description: "会后发送 follow-up 邮件",
        trigger: "会议结束",
        actions: ["拟写邮件"],
        requiresReview: true,
        enabled: true,
        details: "邮件风格：简洁直接",
      },
    ],
    recurringTasks: [
      {
        id: "t1",
        description: "每周一 8:00 生成周报草稿",
        schedule: "每周一 8:00",
        dataSource: "上周会议纪要、CRM 记录",
        outputLocation: "Doc",
      },
    ],
    preferences: ["邮件风格：简洁直接", "纪要 30 分钟内交付", "融资内容脱敏"],
    indexedFilesCount: 18,
    stats: { tasksCompletedThisWeek: 12, meetingsProcessed: 4 },
    knowledgeIndex: [
      { name: "TechVision Q4 Board Deck", summary: "产品路线图与融资进展", path: "Google Drive / Clients / TechVision / Decks", type: "doc" },
      { name: "TechVision 需求访谈纪要", summary: "2026-02-09 需求访谈会议记录", path: "SmartMeet / Docs / doc-meeting-notes-techvision", type: "meeting" },
      { name: "TechVision 产品定位 Deck", summary: "AI 差异化与定价草案", path: "Google Drive / Clients / TechVision / Decks", type: "doc" },
      { name: "TechVision Proposal", summary: "定价与下一步方案", path: "SmartMeet / Docs / doc-proposal-techvision", type: "doc" },
      { name: "Tom & Lisa 跟进邮件", summary: "会议纪要与下一步行动", path: "Gmail / Sent / TechVision", type: "email" },
      { name: "TechVision CRM 记录", summary: "客户阶段、联系人、备注", path: "HubSpot / Companies / TechVision", type: "crm" },
    ],
  },
  {
    id: "jamie",
    name: "Jamie",
    tagline: "RetailMax 全渠道营销与品牌增长",
    avatar: `https://ui-avatars.com/api/?name=Jamie&background=3B8C6E&color=fff&size=128`,
    color: "#3B8C6E",
    client: "RetailMax",
    clientIndustry: "零售品牌",
    automationRules: [
      {
        id: "r1",
        description: "会后自动生成会议纪要 → 需 review",
        trigger: "会议结束",
        actions: ["生成纪要草稿"],
        requiresReview: true,
        enabled: true,
      },
      {
        id: "r2",
        description: "会后更新 CRM",
        trigger: "会议结束",
        actions: ["更新客户阶段、联系人、备注"],
        requiresReview: true,
        enabled: true,
      },
      {
        id: "r3",
        description: "会后发送 follow-up 邮件",
        trigger: "会议结束",
        actions: ["拟写邮件"],
        requiresReview: true,
        enabled: true,
        details: "邮件风格：温暖、重视感",
      },
    ],
    recurringTasks: [
      {
        id: "t1",
        description: "每周一 8:00 生成周报草稿",
        schedule: "每周一 8:00",
        dataSource: "上周会议纪要、CRM 记录",
        outputLocation: "Doc",
      },
    ],
    preferences: ["邮件风格：温暖、重视感"],
    indexedFilesCount: 23,
    stats: { tasksCompletedThisWeek: 8, meetingsProcessed: 3 },
    knowledgeIndex: [
      { name: "RetailMax 工作坊 Agenda", summary: "Q3 营销策略与落地节奏", path: "SmartMeet / Docs / doc-agenda-retailmax", type: "doc" },
      { name: "RetailMax 营销策略", summary: "全渠道协同与会员运营", path: "SmartMeet / Docs / doc-strategy-retailmax", type: "doc" },
      { name: "RetailMax 用户画像 2026", summary: "年轻群体与复购洞察", path: "Google Drive / RetailMax / Research", type: "doc" },
      { name: "Lisa & David 工作坊邀请", summary: "营销策略工作坊日程确认", path: "Gmail / Sent / RetailMax", type: "email" },
      { name: "RetailMax CRM", summary: "CMO Lisa、电商 David 联系人", path: "HubSpot / Companies / RetailMax", type: "crm" },
      { name: "RetailMax 营销策略工作坊", summary: "2026-02-09 工作坊会议", path: "SmartMeet / Meetings", type: "meeting" },
    ],
  },
  {
    id: "morgan",
    name: "Morgan",
    tagline: "CloudFlow 企业客户成功与续约策略",
    avatar: `https://ui-avatars.com/api/?name=Morgan&background=5B7BC0&color=fff&size=128`,
    color: "#5B7BC0",
    client: "CloudFlow",
    clientIndustry: "B2B SaaS",
    automationRules: [
      {
        id: "r1",
        description: "会后自动生成会议纪要 → 需 review",
        trigger: "会议结束",
        actions: ["生成纪要草稿"],
        requiresReview: true,
        enabled: true,
      },
      {
        id: "r2",
        description: "会后更新 CRM",
        trigger: "会议结束",
        actions: ["更新客户阶段、联系人、备注"],
        requiresReview: true,
        enabled: true,
      },
      {
        id: "r3",
        description: "会后发送 follow-up 邮件",
        trigger: "会议结束",
        actions: ["拟写邮件"],
        requiresReview: true,
        enabled: true,
        details: "邮件风格：专业严谨",
      },
    ],
    recurringTasks: [
      {
        id: "t1",
        description: "每周一 8:00 生成周报草稿",
        schedule: "每周一 8:00",
        dataSource: "上周会议纪要、CRM 记录",
        outputLocation: "Doc",
      },
    ],
    preferences: ["邮件风格：专业严谨"],
    indexedFilesCount: 18,
    stats: { tasksCompletedThisWeek: 10, meetingsProcessed: 3 },
    knowledgeIndex: [
      { name: "CloudFlow 周报", summary: "企业客户成功与续约进展", path: "SmartMeet / Docs / doc-report-cloudflow", type: "doc" },
      { name: "CloudFlow 续约沟通", summary: "2026-02-09 续约沟通会议", path: "SmartMeet / Meetings", type: "meeting" },
      { name: "CloudFlow 价值案例库", summary: "客户成功案例与 ROI", path: "Google Drive / CloudFlow / Sales", type: "doc" },
      { name: "续约决策时间线", summary: "客户成功团队内部备忘", path: "Notion / CloudFlow / Renewals", type: "doc" },
      { name: "CloudFlow 客户成功邮件", summary: "本期成果同步与续约计划", path: "Gmail / Sent / CloudFlow", type: "email" },
      { name: "CloudFlow CRM", summary: "企业版续约阶段与联系人", path: "HubSpot / Companies / CloudFlow", type: "crm" },
    ],
  },
];

export const getAdvisorById = (id: AdvisorId): Advisor | undefined =>
  advisors.find((a) => a.id === id);

export const USER_AVATAR = "https://ui-avatars.com/api/?name=Sarah&background=6B6B6B&color=fff&size=128";
