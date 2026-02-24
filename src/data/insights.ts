import type { TopicId } from "./topics";

export type InsightSeverity = "info" | "warning" | "critical";

export interface Insight {
  id: string;
  topicId: TopicId | null;
  type: string;
  severity: InsightSeverity;
  message: string;
  detail?: string;
  createdAt: string;
  followUpQuestion?: string;
}

export const insights: Insight[] = [
  {
    id: "ins-1",
    topicId: "techvision",
    type: "response_delay",
    severity: "warning",
    message: "TechVision CTO 回复时间延长",
    detail:
      "Tom 的平均邮件回复时间从 4 小时增加到 18 小时，可能需要主动跟进。",
    createdAt: "2026-02-23T14:00:00",
    followUpQuestion: "帮我起草一封跟进邮件给 Tom，询问最近项目进展",
  },
  {
    id: "ins-2",
    topicId: "cloudflow",
    type: "overdue_followup",
    severity: "critical",
    message: "CloudFlow 有 2 个逾期 follow-up",
    detail:
      "续约材料定稿（逾期 3 天）和客户拜访确认（逾期 1 天）尚未完成。",
    createdAt: "2026-02-24T09:00:00",
    followUpQuestion: "CloudFlow 的续约材料和客户拜访分别进展如何？",
  },
  {
    id: "ins-3",
    topicId: "retailmax",
    type: "sentiment",
    severity: "info",
    message: "RetailMax CMO 对策略方向表示认可",
    detail:
      "Lisa 在最近邮件中提到 '策略方向很对'，整体沟通情绪积极。",
    createdAt: "2026-02-22T16:00:00",
    followUpQuestion: "基于 Lisa 的正面反馈，下一步策略细化建议是什么？",
  },
  {
    id: "ins-4",
    topicId: null,
    type: "workload",
    severity: "warning",
    message: "本周会议密度高于平均",
    detail:
      "本周已安排 8 场会议，比过去 4 周平均值（5 场）高出 60%。",
    createdAt: "2026-02-24T08:00:00",
    followUpQuestion: "帮我分析本周哪些会议可以合并或推迟",
  },
  {
    id: "ins-5",
    topicId: "techvision",
    type: "deadline",
    severity: "warning",
    message: "TechVision 产品定位 Deck 截止日临近",
    detail:
      "距离董事会要求的交付时间还有 5 天，Deck 初稿已生成但尚未 review。",
    createdAt: "2026-02-24T07:00:00",
    followUpQuestion: "TechVision Deck 还差哪些内容？帮我列一下 checklist",
  },
];

export const getInsightsByTopic = (topicId: TopicId): Insight[] =>
  insights.filter((i) => i.topicId === topicId);

export const getInsightsForContext = (
  context: "all" | TopicId
): Insight[] => {
  if (context === "all") return insights;
  return insights.filter(
    (i) => i.topicId === context || i.topicId === null
  );
};

export const getInsightsBySeverity = (
  severity: InsightSeverity
): Insight[] => insights.filter((i) => i.severity === severity);
