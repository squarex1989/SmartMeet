export interface TranscriptLine {
  speaker: string;
  text: string;
  timestamp: string; // "10:05"
}

// Simulated transcript for TechVision 需求访谈 - used in Meeting view and for "记一下"
export const meetingTranscript: TranscriptLine[] = [
  { speaker: "Sarah", text: "那我们开始吧。Tom、Lisa，感谢今天的时间。", timestamp: "10:00" },
  { speaker: "Tom", text: "好，我们直接说重点。我们需要一份新的产品定位 deck，下周三董事会前给到，重点突出 AI 功能的差异化。", timestamp: "10:02" },
  { speaker: "Lisa", text: "对，投资人很关心我们和竞品的区别。", timestamp: "10:03" },
  { speaker: "Sarah", text: "明白。现有的 proposal 里定价部分要更新，加入我们讨论的企业套餐选项，这部分我会一起整理。", timestamp: "10:05" },
  { speaker: "Tom", text: "现有的 proposal 里定价部分要更新，加入我们讨论的企业套餐选项。", timestamp: "10:06" },
  { speaker: "Lisa", text: "那我们下周二下午再碰一次，确认最终方案。", timestamp: "10:08" },
  { speaker: "Tom", text: "今天聊的那些竞品对比数据，能发一份给我们技术团队看看吗？", timestamp: "10:10" },
  { speaker: "Sarah", text: "没问题，会后我让团队整理好发过去。", timestamp: "10:11" },
];

// Chunks for "记一下" button - each click inserts one of these
export const meetingHighlights = [
  "产品定位 deck 下周三董事会前交付，重点突出 AI 功能差异化。",
  "Proposal 定价部分需更新，加入企业套餐选项。",
  "下周二下午 Follow-up 会议确认最终方案。",
  "竞品对比数据需发送给技术团队。",
];

// Suggested questions for 提问建议
export const suggestedQuestions = [
  { text: "企业套餐的目标客群和定价区间有初步设想吗？", reason: "基于 Tom 刚提到的企业套餐，可以深入了解定位" },
  { text: "董事会最关心的三个指标是什么？", reason: "便于在 deck 中突出对应内容" },
  { text: "技术团队会怎么使用竞品数据？", reason: "确保我们提供的格式和维度符合需求" },
];
