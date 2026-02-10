export type OnboardingStepIndex = number;

export interface OnboardingTurn {
  stepIndex: number;
  speaker: "sarah" | "alex" | "jamie" | "morgan";
  advisorId?: "alex" | "jamie" | "morgan";
  message: string;
  isPreFill?: boolean; // Sarah's message that user sends by clicking
}

// 7 rounds of group + 1 round of private (Alex)
export const onboardingScript: OnboardingTurn[] = [
  // Round 1
  { stepIndex: 0, speaker: "sarah", message: "大家好，我管理 3 个不同行业的客户项目。日常工作是客户会议、策略工作坊、写营销简报和效果复盘。我最大的痛点是花太多时间整理会议记录和重复性文书工作，希望你们帮我自动化这些事情。", isPreFill: true },
  { stepIndex: 0, speaker: "alex", advisorId: "alex", message: "收到 Sarah！我是 Alex，负责 TechVision。我会重点关注科技行业的语境和节奏。" },
  { stepIndex: 0, speaker: "jamie", advisorId: "jamie", message: "Hi Sarah，我是 Jamie，负责 RetailMax。零售品牌的营销节奏我很熟悉。" },
  { stepIndex: 0, speaker: "morgan", advisorId: "morgan", message: "Sarah 你好，Morgan 在这里，负责 CloudFlow。B2B SaaS 的客户沟通我来搞定。" },
  // Round 2
  { stepIndex: 1, speaker: "sarah", message: "我用的工具有：HubSpot 做 CRM，Google Docs 写文档，Google Calendar 管日程，Gmail 发邮件。所有客户项目文件都在 Google Drive 上，按客户名分文件夹。", isPreFill: true },
  { stepIndex: 1, speaker: "alex", advisorId: "alex", message: "已接入 HubSpot、Google Drive、Gmail 和 Calendar。我会开始索引 TechVision 文件夹下的历史文件。" },
  { stepIndex: 1, speaker: "jamie", advisorId: "jamie", message: "同步接入中... 完成。RetailMax 文件夹下发现 23 个文档，正在建立索引。" },
  { stepIndex: 1, speaker: "morgan", advisorId: "morgan", message: "已就绪。CloudFlow 文件夹下有 18 个文档，索引完成后我会汇报。" },
  // Round 3
  { stepIndex: 2, speaker: "sarah", message: "最重要的规则：每次客户会议结束后，需要做三件事——① 整理会议纪要 ② 更新 CRM 客户状态 ③ 给客户发 follow-up 邮件。这三件事每次都花我至少 1 小时。", isPreFill: true },
  { stepIndex: 2, speaker: "alex", advisorId: "alex", message: "明白了。我可以在会后自动完成这三步，但更新 CRM 和发送邮件之前会先给你 review，确保内容无误。会议纪要我会先写好草稿让你确认。" },
  { stepIndex: 2, speaker: "jamie", advisorId: "jamie", message: "我也会遵循同样的流程。问个问题——follow-up 邮件的语气偏正式还是轻松？" },
  // Round 4
  { stepIndex: 3, speaker: "sarah", message: "好问题。TechVision 的邮件要简洁直接，他们是技术团队不喜欢废话；RetailMax 可以稍微热情一些，品牌方喜欢感受到重视；CloudFlow 偏专业严谨。", isPreFill: true },
  { stepIndex: 3, speaker: "jamie", advisorId: "jamie", message: "收到，RetailMax 的邮件我会用更温暖的语气。" },
  { stepIndex: 3, speaker: "morgan", advisorId: "morgan", message: "CloudFlow 邮件会保持专业严谨的基调。" },
  { stepIndex: 3, speaker: "alex", advisorId: "alex", message: "TechVision 了解，简洁为主。" },
  // Round 5
  { stepIndex: 4, speaker: "sarah", message: "另外，每周一上午我需要为每个客户准备一份周报，包括：上周进展、本周计划、关键数据指标。数据来源是上周的会议纪要和 CRM 记录。", isPreFill: true },
  { stepIndex: 4, speaker: "morgan", advisorId: "morgan", message: "我可以在每周一早上 8 点自动为 CloudFlow 生成周报草稿，放到你的 Doc 里待 review。" },
  { stepIndex: 4, speaker: "alex", advisorId: "alex", message: "TechVision 的也一样，8 点准时交付。" },
  { stepIndex: 4, speaker: "jamie", advisorId: "jamie", message: "RetailMax 同步。需要我用固定模板还是你有偏好的格式？" },
  // Round 6
  { stepIndex: 5, speaker: "sarah", message: "用统一模板就好，你们三个对齐一下格式。", isPreFill: true },
  { stepIndex: 5, speaker: "alex", advisorId: "alex", message: "好的。我先拟一个模板草稿，同步给 Jamie 和 Morgan review，然后统一给你确认。" },
  { stepIndex: 5, speaker: "jamie", advisorId: "jamie", message: "等 Alex 的模板，收到后我会确认或提修改建议。" },
  { stepIndex: 5, speaker: "morgan", advisorId: "morgan", message: "同意这个流程。" },
  // Round 7 - switch to Alex 1:1
  { stepIndex: 6, speaker: "sarah", message: "TechVision 的 CTO Tom 性子急，会议纪要必须在会后 30 分钟内发出。另外他们下个月有融资路演，最近几次会议的内容可能涉及敏感信息，纪要里注意脱敏。", isPreFill: true },
  { stepIndex: 6, speaker: "alex", advisorId: "alex", message: "收到两点：① TechVision 会后任务优先处理，30 分钟内交付 ② 融资相关内容在纪要中做脱敏处理。我会把这两条加进我的工作规划，你稍后可以在 review 里确认。" },
];

export const getPreFillForStep = (stepIndex: number): string | null => {
  const turn = onboardingScript.find((t) => t.stepIndex === stepIndex && t.isPreFill);
  return turn?.message ?? null;
};

export const getRepliesForStep = (stepIndex: number): OnboardingTurn[] =>
  onboardingScript.filter((t) => t.stepIndex === stepIndex && t.speaker !== "sarah");
