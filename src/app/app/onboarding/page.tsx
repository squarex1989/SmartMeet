"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPreFillForStep, getRepliesForStep } from "@/data/onboarding-script";
import { advisors } from "@/data/advisors";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [chatStepIndex, setChatStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ speaker: string; text: string; advisorId?: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [privateChatAdvisor, setPrivateChatAdvisor] = useState<"alex" | "jamie" | "morgan" | null>(null);

  useEffect(() => {
    if (step === 2) {
      const pre = getPreFillForStep(chatStepIndex);
      setInputValue(pre ?? "");
    }
  }, [step, chatStepIndex]);

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold tracking-tight">你好 Sarah，让我们为你的客户创建 Advisor</h1>
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          为每个客户配置专属 AI 顾问，会前准备、会中协助、会后跟进，全部自动化。
        </p>
        <Button className="mt-8" onClick={() => setStep(1)}>
          开始配置
        </Button>
      </div>
    );
  }

  // Step 1: Create Advisor (3 cards, pre-filled)
  if (step === 1) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">创建 Advisor</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {advisors.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium"
                    style={{ border: `2px solid ${a.color}` }}
                  >
                    {a.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.tagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>客户</strong> {a.client}</p>
                <p><strong>行业</strong> {a.clientIndustry}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={() => setStep(2)}>下一步</Button>
        </div>
      </div>
    );
  }

  // Step 2: Group chat (scripted)
  if (step === 2) {
    const preFill = getPreFillForStep(chatStepIndex);
    const replies = getRepliesForStep(chatStepIndex);

    const handleSend = () => {
      if (!preFill && !inputValue.trim()) return;
      const text = inputValue.trim() || preFill || "";
      setMessages((prev) => [...prev, { speaker: "Sarah", text }]);
      setInputValue("");
      setIsTyping(true);

      // Simulate advisor replies
      let delay = 0;
      replies.forEach((r) => {
        const advisor = r.advisorId ? advisors.find((a) => a.id === r.advisorId) : null;
        setTimeout(() => {
          setMessages((prev) => [...prev, { speaker: advisor?.name ?? r.speaker, text: r.message, advisorId: r.advisorId }]);
        }, delay);
        delay += 400;
      });

      setTimeout(() => {
        setIsTyping(false);
        if (chatStepIndex < TOTAL_STEPS - 1) {
          setChatStepIndex(chatStepIndex + 1);
          const nextPreFill = getPreFillForStep(chatStepIndex + 1);
          setInputValue(nextPreFill ?? "");
        }
      }, delay + 200);
    };

    const isStep7 = chatStepIndex === 6;
    const nextPreFill = getPreFillForStep(chatStepIndex);

    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn("h-2 w-2 rounded-full", i === chatStepIndex ? "bg-foreground" : "bg-muted")}
              />
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setStep(3)}>跳过</Button>
        </div>

        <div className="flex-1 overflow-auto space-y-4 border rounded-lg p-4 bg-muted/20">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.speaker === "Sarah" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] rounded-lg px-3 py-2", m.speaker === "Sarah" ? "bg-foreground text-background" : "bg-background border")}>
                {m.advisorId && (
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">{m.speaker}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {isTyping && <p className="text-sm text-muted-foreground">...</p>}
        </div>

        {isStep7 && !messages.some((m) => m.text.includes("TechVision 的 CTO Tom")) && (
          <p className="text-sm text-muted-foreground mt-2">点击一个 Advisor 进行私聊叮嘱</p>
        )}
        {isStep7 && privateChatAdvisor === null && (
          <div className="flex gap-2 mt-2">
            {advisors.map((a) => (
              <Button
                key={a.id}
                variant="outline"
                size="sm"
                onClick={() => setPrivateChatAdvisor(a.id)}
              >
                {a.name}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={isTyping || (!inputValue.trim() && !nextPreFill)}>
            发送
          </Button>
          {chatStepIndex === 6 && messages.some((m) => m.text.includes("我会把这两条加进我的工作规划")) && (
            <Button variant="outline" onClick={() => setStep(3)}>下一步：Review 工作规划</Button>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Review 工作规划
  if (step === 3) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Review 工作规划</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {advisors.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm" style={{ border: `2px solid ${a.color}` }}>
                    {a.name[0]}
                  </div>
                  <span className="font-medium">{a.name}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="font-medium text-muted-foreground">自动化规则</p>
                {a.automationRules.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-2">
                    <span>{r.description}</span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">开</span>
                  </div>
                ))}
                <p className="font-medium text-muted-foreground mt-4">定期任务</p>
                {a.recurringTasks.map((t) => (
                  <p key={t.id}>{t.description}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={() => setStep(4)}>全部确认</Button>
        </div>
      </div>
    );
  }

  // Step 4: Done
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold tracking-tight">你的 3 位 Advisor 已经就绪！</h2>
      <div className="flex gap-4 mt-6">
        {advisors.map((a) => (
          <div key={a.id} className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-lg font-medium" style={{ border: `2px solid ${a.color}` }}>
              {a.name[0]}
            </div>
            <span className="text-sm mt-2">{a.name}</span>
          </div>
        ))}
      </div>
      <Button className="mt-8" onClick={() => router.push("/app/calendar")}>
        进入工作台
      </Button>
    </div>
  );
}
