"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import type { DecisionItem } from "@/data/decision-items";
import type { ChatMessage } from "@/data/chat-messages";

const decisionResponses: Record<string, Record<string, string>> = {
  "dec-1": {
    "加速提案，本周内完成 review":
      "好的，我来帮你制定加速计划。\n\n**加速方案分析：**\n\n✅ **优势：**\n- 赶上下周三董事会窗口，抢占先机\n- 展示团队执行力和响应速度\n\n⚠️ **风险与应对：**\n- 质量风险：建议优先 review 核心数据页（第 5-8 页），非核心部分可后续迭代\n- 时间紧张：我已帮你拆解任务，今天完成数据校验，明天完成整体 review\n\n**下一步行动：**\n1. 今天 17:00 前 — 我先跑一遍竞品数据准确性检查，结果发你 review\n2. 明天上午 — 你 review Deck 整体逻辑和叙事\n3. 明天下午 — 最终定稿，我同步准备董事会 talking points\n\n需要我现在开始数据校验吗？",
    "按原计划推进，争取延期一周":
      "明白，我来帮你准备延期沟通方案。\n\n**延期方案分析：**\n\n✅ **优势：**\n- 充足时间打磨 Deck 质量，数据更扎实\n- 可以补充 Lisa 提到的会员运营数据维度\n\n⚠️ **风险与应对：**\n- 董事会等待意愿不确定：建议先发一份「进展预览」给 Tom，展示已有成果\n- 竞品可能抢先：加入最新竞品动态对比数据\n\n**建议行动：**\n1. 今天 — 我帮你起草一封邮件给 Tom，说明推迟原因并附上进展预览\n2. 本周 — 从容完成完整 review + 补充数据\n3. 下周一 — 最终定稿提交\n\n需要我先起草给 Tom 的邮件吗？",
    _think:
      "好的，我来帮你全面分析 TechVision 提案节奏。\n\n**当前状态：**\n- Pitch Deck 初稿已生成（12 页），第 7 页竞品数据待 review\n- Tom 要求下周三董事会前看到产品定位 Deck\n- Lisa 上周邮件补充了会员运营数据\n\n**加速 vs. 延期对比：**\n\n| 维度 | 加速（本周完成） | 延期（争取一周） |\n|------|-----------------|----------------|\n| 质量 | 中等，需聚焦核心页面 | 高，可充分打磨 |\n| 时间窗口 | ✅ 赶上董事会 | ⚠️ 需沟通延期 |\n| Tom 印象 | 展示执行力 | 需要进展预览维持信心 |\n\n**我的建议：** 加速方案风险可控，建议优先赶董事会节点。我可以今天先跑数据校验，减轻你的 review 负担。\n\n你倾向哪个方向？",
  },
  "dec-2": {
    "维持现有报价，加强关系维护":
      "好的，我来帮你制定关系维护计划。\n\n**方案分析：**\n\n✅ **优势：**\n- 维持利润率，不打破定价底线\n- 关系维护成本低于降价成本\n\n⚠️ **注意事项：**\n- 逾期 3 天的 follow-up 需要立即处理，先恢复沟通节奏\n- 客户沉默可能不只是价格因素，需排查服务满意度\n\n**行动计划：**\n1. 今天 — 我帮你起草一封温暖专业的关怀邮件\n2. 本周三 — 安排 30 分钟线上沟通，了解客户真实想法\n3. 本周五 — 根据沟通结果调整策略\n\n需要我现在开始起草关怀邮件吗？",
    "调整报价方案以降低续约风险":
      "明白，我来帮你准备报价调整方案。\n\n**方案分析：**\n\n✅ **优势：**\n- 直接回应可能的价格敏感性\n- 降低流失风险，保住收入基本盘\n\n⚠️ **建议策略：**\n- 不建议直接降价，改为「增值不加价」模式\n- 可以提供：延长服务期 1 个月 / 赠送额外培训 / 升级 SLA\n\n**我已准备的备选方案：**\n1. 方案 A：年费不变 + 赠送 1 个月服务\n2. 方案 B：年费降 8% + 签两年长约\n3. 方案 C：年费不变 + 升级为白金 SLA\n\n需要我帮你详细测算每个方案对利润的影响吗？",
    "安排高层拜访重新建立信任":
      "好的，这是一个很好的策略。我来帮你筹备高层拜访。\n\n**方案分析：**\n\n✅ **优势：**\n- 高层出面体现重视程度，快速修复信任\n- 绕过执行层直接与决策者沟通\n\n**筹备计划：**\n1. 今天 — 我帮你起草拜访邀约邮件，建议下周安排\n2. 邮件发出前 — 整理 CloudFlow 完整服务回顾和续约价值点\n3. 拜访前 — 我会准备一份客户 360° 视图，包含历史合作成果、关键决策点\n\n**会议议程建议：**\n- 合作回顾 & 成果展示（15 分钟）\n- 客户反馈与需求倾听（20 分钟）\n- 续约方案讨论（15 分钟）\n\n需要我先准备邮件和拜访材料吗？",
    _think:
      "好的，我来帮你全面分析 CloudFlow 续约策略。\n\n**当前风险信号：**\n- Follow-up 逾期 3 天未处理\n- 客户近两周沟通频率下降 40%\n- 续约到期日在 30 天后\n\n**三个方向对比：**\n\n| 方向 | 成功概率 | 时间投入 | 利润影响 |\n|------|---------|---------|--------|\n| 维持报价+关系维护 | 中 | 低 | 无 |\n| 调整报价 | 中高 | 中 | 降 5-10% |\n| 高层拜访 | 高 | 高 | 无 |\n\n**我的建议：** 先通过关怀邮件恢复沟通，同时准备高层拜访作为 Plan B。在了解客户真实想法之前，不建议主动降价。\n\n你觉得这个思路如何？",
  },
};

interface DecisionCardProps {
  item: DecisionItem;
  showTopic?: boolean;
}

export function DecisionCard({ item, showTopic }: DecisionCardProps) {
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setCommandRoomOverlay = useAppStore((s) => s.setCommandRoomOverlay);
  const injectMessages = useAppStore((s) => s.injectMessages);
  const setMainView = useAppStore((s) => s.setMainView);
  const topic = showTopic ? getTopicById(item.topicId) : null;

  const sendAndNavigate = (userText: string, aiText: string) => {
    const now = new Date().toISOString();
    const uid = `inj-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: `${uid}-u`,
      topicId: item.topicId,
      role: "user",
      content: [{ type: "text", text: userText }],
      createdAt: now,
    };
    const aiMsg: ChatMessage = {
      id: `${uid}-a`,
      topicId: item.topicId,
      role: "shadow",
      content: [{ type: "text", text: aiText }],
      createdAt: new Date(Date.now() + 1000).toISOString(),
    };
    injectMessages(item.topicId, [userMsg, aiMsg]);
    setMainView("command-room");
    setCurrentContext(item.topicId);
    setCommandRoomOverlay(null);
  };

  const handleThinkWithAi = () => {
    const userText = item.aiPrompt ?? `帮我分析：${item.title}`;
    const aiText = decisionResponses[item.id]?._think
      ?? `好的，我来帮你分析「${item.title}」。\n\n${item.context}\n\n让我梳理一下各方面的利弊，稍后给你完整分析。`;
    sendAndNavigate(userText, aiText);
  };

  const handleOptionClick = (option: string) => {
    const userText = `关于「${item.title}」，我倾向于：${option}`;
    const aiText = decisionResponses[item.id]?.[option]
      ?? `收到，你选择了「${option}」。我来帮你分析这个方向的可行性和具体行动计划。`;
    sendAndNavigate(userText, aiText);
  };

  return (
    <div className="bg-white shadow-sm border border-stone-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm">{item.title}</span>
            {topic && (
              <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
                {topic.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-stone-500 leading-relaxed">{item.context}</p>
          {item.options && item.options.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleOptionClick(opt)}
                  className="inline-block rounded-full bg-stone-100 border border-stone-200 px-2.5 py-1 text-[10px] text-stone-500 hover:text-stone-800 hover:border-orange-200 hover:bg-orange-100/60 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={handleThinkWithAi}
          className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-4 py-2 shadow-md shadow-orange-500/20 transition-all font-bold text-[11px]"
        >
          <Sparkles className="h-3 w-3" />
          Think with AI
        </button>
      </div>
    </div>
  );
}
