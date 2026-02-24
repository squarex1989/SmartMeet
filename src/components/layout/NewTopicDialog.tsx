"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "ask_goal" | "ask_category" | "confirm" | "done";

interface Message {
  role: "shadow" | "user";
  text: string;
}

const CATEGORY_OPTIONS = [
  { value: "client", label: "客户", icon: "🤝" },
  { value: "project", label: "项目", icon: "📁" },
  { value: "goal", label: "目标", icon: "🎯" },
];

function generateTopicName(goal: string): string {
  const trimmed = goal.trim();
  if (trimmed.length <= 20) return trimmed;
  return trimmed.slice(0, 20) + "…";
}

interface NewTopicDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewTopicDialog({ open, onClose }: NewTopicDialogProps) {
  const [step, setStep] = useState<Step>("ask_goal");
  const [messages, setMessages] = useState<Message[]>([
    { role: "shadow", text: "你好！我来帮你创建一个新的 Topic。\n你想要达成什么目标？" },
  ]);
  const [input, setInput] = useState("");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setStep("ask_goal");
      setMessages([
        { role: "shadow", text: "你好！我来帮你创建一个新的 Topic。\n你想要达成什么目标？" },
      ]);
      setInput("");
      setGoal("");
      setCategory("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const addMessages = useCallback(
    (...msgs: Message[]) => {
      setMessages((prev) => [...prev, ...msgs]);
    },
    []
  );

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (step === "ask_goal") {
      setGoal(text);
      addMessages(
        { role: "user", text },
        { role: "shadow", text: `明白了，「${generateTopicName(text)}」。\n这个 Topic 属于哪个类别？` }
      );
      setStep("ask_category");
    } else if (step === "confirm") {
      if (text.toLowerCase().includes("是") || text.toLowerCase().includes("yes") || text.toLowerCase().includes("确认") || text.toLowerCase().includes("好")) {
        addMessages(
          { role: "user", text },
          { role: "shadow", text: "Topic 已创建！正在跳转…" }
        );
        setStep("done");
        setTimeout(() => {
          toast.success(`Topic "${generateTopicName(goal)}" 已创建`);
          onClose();
        }, 800);
      } else {
        addMessages(
          { role: "user", text },
          { role: "shadow", text: "好的，让我们重新来过。\n你想要达成什么目标？" }
        );
        setStep("ask_goal");
        setGoal("");
        setCategory("");
      }
    }
  };

  const handleCategorySelect = (cat: string) => {
    const selected = CATEGORY_OPTIONS.find((c) => c.value === cat);
    if (!selected) return;
    setCategory(cat);
    const topicName = generateTopicName(goal);
    addMessages(
      { role: "user", text: `${selected.icon} ${selected.label}` },
      {
        role: "shadow",
        text: `很好！以下是 Topic 摘要：\n\n📌 名称：${topicName}\n📂 类别：${selected.label}\n🎯 目标：${goal}\n\n确认创建吗？（输入"是"确认）`,
      }
    );
    setStep("confirm");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 flex flex-col rounded-xl border border-border bg-background shadow-xl overflow-hidden" style={{ maxHeight: "70vh" }}>
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

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
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

          {step === "ask_category" && (
            <div className="flex gap-2 pt-1">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCategorySelect(opt.value)}
                  className={cn(
                    "interactive-base flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    category === opt.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-surface-1 text-foreground hover:border-accent/30 hover:bg-surface-2"
                  )}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {step !== "done" && step !== "ask_category" && (
          <div className="shrink-0 px-4 py-3 border-t border-border flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={step === "ask_goal" ? "描述你的目标…" : '输入 "是" 确认，或重新开始…'}
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
