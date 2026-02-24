"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, SendHorizontal, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { topicTags, type TopicTag } from "@/data/topics";

type Step = "conversation" | "tags" | "confirm" | "done";

interface Message {
  role: "shadow" | "user";
  text: string;
}

interface ScriptedExchange {
  userText: string;
  shadowReply: string;
}

const DEMO_SCRIPT: ScriptedExchange[] = [
  {
    userText: "今年升职",
    shadowReply:
      "好的，「今年升职」。你目前是什么职位，期望晋升到什么级别？",
  },
  {
    userText: "高级工程师，想升 Staff Engineer",
    shadowReply:
      "明白了，从高级工程师到 Staff Engineer 是一个很有挑战的目标。你觉得需要在哪些方面重点发力？比如技术深度、跨团队影响力、还是 mentor 经验？",
  },
  {
    userText: "跨团队影响力和技术 leadership",
    shadowReply:
      '很好，我已经理解了你的目标。\n\n我帮你梳理一下：\n\n目标：今年从高级工程师晋升为 Staff Engineer\n重点方向：跨团队影响力 + 技术 Leadership\n\n接下来你可以为这个 Topic 添加标签，方便日后管理和检索。',
  },
];

function generateTopicName(goal: string): string {
  const trimmed = goal.trim();
  if (trimmed.length <= 20) return trimmed;
  return trimmed.slice(0, 20) + "\u2026";
}

interface NewTopicDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewTopicDialog({ open, onClose }: NewTopicDialogProps) {
  const [step, setStep] = useState<Step>("conversation");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "shadow",
      text: "你好！描述一下你想达成的目标，我来帮你创建 Topic。",
    },
  ]);
  const [input, setInput] = useState("");
  const [scriptIndex, setScriptIndex] = useState(0);
  const [goal, setGoal] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [localTags, setLocalTags] = useState<TopicTag[]>(topicTags);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, step, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setStep("conversation");
      setMessages([
        {
          role: "shadow",
          text: "你好！描述一下你想达成的目标，我来帮你创建 Topic。",
        },
      ]);
      setInput("");
      setScriptIndex(0);
      setGoal("");
      setSelectedTagIds([]);
      setNewTagInput("");
      setShowNewTagInput(false);
      setLocalTags(topicTags);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const addMessages = useCallback((...msgs: Message[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (step === "conversation" && scriptIndex < DEMO_SCRIPT.length) {
      const exchange = DEMO_SCRIPT[scriptIndex];
      if (scriptIndex === 0) setGoal(text);

      addMessages({ role: "user", text });

      setTimeout(() => {
        addMessages({ role: "shadow", text: exchange.shadowReply });

        const nextIdx = scriptIndex + 1;
        setScriptIndex(nextIdx);

        if (nextIdx >= DEMO_SCRIPT.length) {
          setTimeout(() => setStep("tags"), 300);
        } else {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }, 400);
    } else if (step === "confirm") {
      if (
        text.toLowerCase().includes("是") ||
        text.toLowerCase().includes("yes") ||
        text.toLowerCase().includes("确认") ||
        text.toLowerCase().includes("好")
      ) {
        addMessages(
          { role: "user", text },
          { role: "shadow", text: "Topic 已创建！正在跳转\u2026" }
        );
        setStep("done");
        setTimeout(() => {
          toast.success(`Topic "${generateTopicName(goal)}" 已创建`);
          onClose();
        }, 800);
      } else {
        addMessages(
          { role: "user", text },
          {
            role: "shadow",
            text: "好的，让我们重新来过。\n描述一下你想达成的目标：",
          }
        );
        setStep("conversation");
        setScriptIndex(0);
        setGoal("");
        setSelectedTagIds([]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = () => {
    const name = newTagInput.trim();
    if (!name) return;
    const colors = ["#f97316", "#84cc16", "#14b8a6", "#a855f7", "#ef4444"];
    const newTag: TopicTag = {
      id: `tag-custom-${Date.now()}`,
      name,
      color: colors[localTags.length % colors.length],
    };
    setLocalTags((prev) => [...prev, newTag]);
    setSelectedTagIds((prev) => [...prev, newTag.id]);
    setNewTagInput("");
    setShowNewTagInput(false);
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTag();
    } else if (e.key === "Escape") {
      setShowNewTagInput(false);
      setNewTagInput("");
    }
  };

  const handleConfirmTags = () => {
    const tagNames = selectedTagIds
      .map((id) => localTags.find((t) => t.id === id)?.name)
      .filter(Boolean);
    const tagStr =
      tagNames.length > 0 ? tagNames.join("、") : "无";

    const topicName = generateTopicName(goal || "今年升职");
    addMessages({
      role: "shadow",
      text: `以下是 Topic 摘要：\n\n名称：${topicName}\n目标：从高级工程师晋升为 Staff Engineer，重点发力跨团队影响力和技术 Leadership\n标签：${tagStr}\n\n确认创建吗？（输入"是"确认）`,
    });
    setStep("confirm");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!open) return null;

  const showInput = step === "conversation" || step === "confirm";
  const placeholder =
    step === "conversation"
      ? scriptIndex === 0
        ? "描述你的目标\u2026"
        : "继续回答\u2026"
      : '输入 "是" 确认，或重新开始\u2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md mx-4 flex flex-col rounded-xl border border-border bg-background shadow-xl overflow-hidden"
        style={{ maxHeight: "75vh" }}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h3 className="text-sm font-semibold">创建新 Topic</h3>
          <button
            type="button"
            onClick={onClose}
            className="interactive-base rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  msg.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {step === "tags" && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-muted-foreground">
                选择或创建标签：
              </p>
              <div className="flex flex-wrap gap-2">
                {localTags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "interactive-base inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        selected
                          ? "border-transparent text-white"
                          : "border-border bg-surface-1 text-foreground hover:bg-surface-2"
                      )}
                      style={
                        selected
                          ? { backgroundColor: tag.color }
                          : undefined
                      }
                    >
                      {selected && <Check className="h-3 w-3" />}
                      {tag.name}
                    </button>
                  );
                })}
                {!showNewTagInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagInput(true);
                      setTimeout(() => tagInputRef.current?.focus(), 50);
                    }}
                    className="interactive-base inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  >
                    <Plus className="h-3 w-3" />
                    新建标签
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-surface-1 px-2 py-1">
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleNewTagKeyDown}
                      placeholder="标签名称"
                      className="w-20 bg-transparent text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      disabled={!newTagInput.trim()}
                      className="interactive-base rounded-full p-0.5 text-accent disabled:opacity-40"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleConfirmTags}
                className="interactive-base w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                继续
              </button>
            </div>
          )}
        </div>

        {showInput && (
          <div className="shrink-0 px-4 py-3 border-t border-border flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-md border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent/40 interactive-subtle"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="interactive-base flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground disabled:opacity-40"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
