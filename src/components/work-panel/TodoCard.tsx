"use client";

import { CircleDot, Sparkles } from "lucide-react";
import { getTopicById } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import type { TodoItem } from "@/data/todo-items";
import type { ChatMessage } from "@/data/chat-messages";

const todoResponses: Record<string, string> = {
  "todo-1":
    "好的，我来帮你审阅 Pitch Deck 第 7 页的竞品数据。\n\n**初步检查结果：**\n\n✅ **数据准确：**\n- AlphaAI 融资金额（$120M Series C）已核实\n- NeuralEdge 客户数（200+）与公开数据一致\n\n⚠️ **发现 2 处需修正：**\n1. DataMind 的年收入数据引用了 2024 年报告，建议更新为 2025 最新数据（$45M → $62M）\n2. 缺少 NeuralEdge 在医疗行业的市占率数据，建议补充（约 18%）\n\n💡 **优化建议：**\n- 建议增加一列「我们的优势」，突出行业知识图谱的差异化\n- 图表建议使用雷达图替代表格，更直观展示多维对比\n\n需要我直接更新到 Deck 中吗？",
  "todo-2":
    "好的，我来帮你起草回复 Lisa 的邮件。\n\n**邮件草稿：**\n\n---\n**To:** Lisa Chen\n**Subject:** Re: 会员运营数据细节确认\n\nHi Lisa,\n\n感谢你上周的邮件，关于会员运营数据的几个问题，以下是回复：\n\n1. **月活跃用户增长**：过去 3 个月环比增长 12%，主要来自企业端客户\n2. **留存率**：30 日留存率 78%，高于行业平均的 65%\n3. **ARPU 趋势**：从 $45 提升至 $52，升级转化率 23%\n\n如果还需要更详细的数据维度，我可以安排一个 15 分钟的快速对齐。\n\nBest,\nSarah\n\n---\n\n这封邮件覆盖了 Lisa 询问的主要数据点。需要我调整语气或补充其他内容吗？",
};

interface TodoCardProps {
  item: TodoItem;
  showTopic?: boolean;
}

export function TodoCard({ item, showTopic }: TodoCardProps) {
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setCommandRoomOverlay = useAppStore((s) => s.setCommandRoomOverlay);
  const injectMessages = useAppStore((s) => s.injectMessages);
  const setMainView = useAppStore((s) => s.setMainView);
  const topic = showTopic ? getTopicById(item.topicId) : null;

  const handleStartWithAi = () => {
    const userText = item.aiPrompt ?? `帮我处理：${item.title}`;
    const aiText = todoResponses[item.id]
      ?? `好的，我来帮你处理「${item.title}」。\n\n${item.summary}\n\n让我先分析一下具体情况，马上给你建议。`;
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

  return (
    <div className="rounded-lg border border-border bg-surface-1 p-3">
      <div className="flex items-start gap-2">
        <CircleDot className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm">{item.title}</span>
            {topic && (
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {topic.name}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.summary}</p>
          {item.dueDate && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              Due: {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={handleStartWithAi}
          className="interactive-base inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground hover:bg-accent/90"
        >
          <Sparkles className="h-3 w-3" />
          Start with AI
        </button>
      </div>
    </div>
  );
}
