import type { TopicId } from "./topics";

export type DecisionUrgency = "high" | "medium" | "low";

export interface DecisionItem {
  id: string;
  topicId: TopicId;
  title: string;
  context: string;
  options?: string[];
  urgency: DecisionUrgency;
  /** Pre-filled prompt when user clicks "Think with AI" */
  aiPrompt?: string;
}

export const decisionItems: DecisionItem[] = [
  {
    id: "dec-1",
    topicId: "techvision",
    title: "TechVision 是否应加速提案节奏？",
    context: "Tom 提到下周三董事会需要看到产品定位 Deck，当前初稿已生成但未 review。加速可能牺牲质量，不加速可能错过窗口期。",
    options: ["加速提案，本周内完成 review", "按原计划推进，争取延期一周"],
    urgency: "high",
    aiPrompt: "帮我分析 TechVision 提案节奏的利弊，考虑董事会时间窗口和质量之间的权衡",
  },
  {
    id: "dec-2",
    topicId: "cloudflow",
    title: "CloudFlow 续约策略是否需要调整？",
    context: "续约 follow-up 已逾期 3 天，客户最近沟通频率下降。AI 检测到续约风险上升信号，建议评估是否需要调整报价或服务方案。",
    options: ["维持现有报价，加强关系维护", "调整报价方案以降低续约风险", "安排高层拜访重新建立信任"],
    urgency: "high",
    aiPrompt: "帮我分析 CloudFlow 续约策略，考虑续约风险信号和可选方案",
  },
];

export const getDecisionsByTopic = (topicId: TopicId): DecisionItem[] =>
  decisionItems.filter((d) => d.topicId === topicId);

export const getDecisionsForContext = (context: "all" | TopicId): DecisionItem[] => {
  if (context === "all") return decisionItems;
  return decisionItems.filter((d) => d.topicId === context);
};
