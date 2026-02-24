export type TopicId = string;
export type TopicType = "client" | "project" | "goal";

export interface TopicTag {
  id: string;
  name: string;
  color: string;
}

export const topicTags: TopicTag[] = [
  { id: "tag-client", name: "客户", color: "#6366f1" },
  { id: "tag-project", name: "项目", color: "#8b5cf6" },
  { id: "tag-goal", name: "目标", color: "#ec4899" },
  { id: "tag-career", name: "职业发展", color: "#f59e0b" },
  { id: "tag-strategy", name: "策略", color: "#10b981" },
  { id: "tag-finance", name: "财务", color: "#06b6d4" },
];

export interface AutomationOverride {
  id: string;
  description: string;
  value: string;
}

export interface Topic {
  id: TopicId;
  name: string;
  type: TopicType;
  icon: string;
  description: string;
  automationOverrides: AutomationOverride[];
  relatedTopicIds: TopicId[];
  pendingCount: number;
  createdAt: string;
}

export const topics: Topic[] = [
  {
    id: "techvision",
    name: "TechVision",
    type: "client",
    icon: "🚀",
    description: "AI 产品战略与融资路演 — 科技创业公司",
    automationOverrides: [
      { id: "ov-1", description: "邮件风格", value: "简洁直接" },
      { id: "ov-2", description: "纪要交付时间", value: "30 分钟内" },
      { id: "ov-3", description: "融资内容脱敏", value: "是" },
    ],
    relatedTopicIds: ["fundraising", "ai-positioning"],
    pendingCount: 3,
    createdAt: "2026-01-15T10:00:00",
  },
  {
    id: "retailmax",
    name: "RetailMax",
    type: "client",
    icon: "🛍️",
    description: "全渠道营销与品牌增长 — 零售品牌",
    automationOverrides: [
      { id: "ov-4", description: "邮件风格", value: "温暖、重视感" },
    ],
    relatedTopicIds: [],
    pendingCount: 1,
    createdAt: "2026-01-20T09:00:00",
  },
  {
    id: "cloudflow",
    name: "CloudFlow",
    type: "client",
    icon: "☁️",
    description: "企业客户成功与续约策略 — B2B SaaS",
    automationOverrides: [
      { id: "ov-5", description: "邮件风格", value: "专业严谨" },
    ],
    relatedTopicIds: [],
    pendingCount: 2,
    createdAt: "2026-01-22T14:00:00",
  },
  {
    id: "fundraising",
    name: "Fundraising 2026",
    type: "project",
    icon: "💰",
    description: "2026 年度融资计划与投资人沟通",
    automationOverrides: [],
    relatedTopicIds: ["techvision", "ai-positioning"],
    pendingCount: 0,
    createdAt: "2026-02-01T08:00:00",
  },
  {
    id: "ai-positioning",
    name: "AI Positioning",
    type: "goal",
    icon: "🎯",
    description: "建立 AI 差异化定位与市场认知",
    automationOverrides: [],
    relatedTopicIds: ["techvision", "fundraising"],
    pendingCount: 0,
    createdAt: "2026-02-05T10:00:00",
  },
];

export const getTopicById = (id: TopicId): Topic | undefined =>
  topics.find((t) => t.id === id);

export const getTopicsByType = (type: TopicType): Topic[] =>
  topics.filter((t) => t.type === type);

export const getAllPendingCount = (): number =>
  topics.reduce((sum, t) => sum + t.pendingCount, 0);

export const USER_AVATAR =
  "https://ui-avatars.com/api/?name=Sarah&background=6B6B6B&color=fff&size=128";
