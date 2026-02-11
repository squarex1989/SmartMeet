"use client";

import { useState, useEffect, useRef } from "react";
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
  // privateChatAdvisor removed — users can DM advisors in Command Room
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 2) {
      const pre = getPreFillForStep(chatStepIndex);
      setInputValue(pre ?? "");
    }
  }, [step, chatStepIndex]);

  useEffect(() => {
    if (step === 2) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, messages.length, isTyping]);

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold tracking-tight">你好 Sarah，让我们为你的客户雇佣 Advisor</h1>
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
        <h2 className="text-xl font-semibold mb-6">雇佣 Advisor</h2>
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

    const nextPreFill = getPreFillForStep(chatStepIndex);

    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-full">
        {/* 左侧：群聊会话列表，与 Chat 页一致 */}
        <aside className="w-64 shrink-0 border-r border-border bg-background flex flex-col overflow-hidden">
          <div className="border-b border-border p-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">对话</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {/* All Advisors - 群聊，与 Chat 页一致 */}
            <div className={cn("w-full border-b border-border px-3 py-3 bg-muted flex items-center gap-3")}>
              <div className="relative shrink-0 flex items-center">
                {advisors.slice(0, 3).map((a, i) => (
                  <div
                    key={a.id}
                    className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background"
                    style={{
                      marginLeft: i === 0 ? 0 : -6,
                      borderColor: a.color,
                      zIndex: 3 - i,
                    }}
                  >
                    {a.name[0]}
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">All Advisors</p>
                <p className="text-xs text-muted-foreground truncate">3 位成员: Alex, Jamie, Morgan</p>
              </div>
            </div>
            {/* 各 Advisor 单聊，与 Chat 页一致 */}
            {advisors.map((a) => (
              <div key={a.id} className="w-full border-b border-border px-3 py-3 flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0"
                  style={{ border: `2px solid ${a.color}` }}
                >
                  {a.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 右侧：消息区 + 输入 */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
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

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.speaker === "Sarah" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] space-y-1", m.speaker === "Sarah" ? "order-2" : "order-1")}>
                  {m.advisorId && (() => {
                    const advisor = advisors.find((a) => a.id === m.advisorId);
                    return advisor ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs"
                          style={{ border: `2px solid ${advisor.color}` }}
                        >
                          {advisor.name[0]}
                        </div>
                        <span className="text-sm font-medium">{advisor.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{advisor.tagline}</span>
                      </div>
                    ) : null;
                  })()}
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      m.speaker === "Sarah" ? "bg-foreground text-background" : "bg-muted border border-border"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <p className="text-sm text-muted-foreground">...</p>}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-4 flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入消息..."
              rows={5}
              className="flex-1 min-h-0 max-h-[12rem] resize-none rounded-md border border-border px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex flex-col gap-2 shrink-0">
              <Button onClick={handleSend} disabled={isTyping || (!inputValue.trim() && !nextPreFill)}>
                发送
              </Button>
              {chatStepIndex === 6 && messages.some((m) => m.text.includes("我会把这两条加进我的工作规划")) && (
                <Button variant="outline" onClick={() => setStep(3)}>下一步：Review 工作规划</Button>
              )}
            </div>
          </div>
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
