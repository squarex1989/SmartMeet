"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getTopicById } from "@/data/topics";
import { getMessagesByTopic, groupMessagesBySessions } from "@/data/chat-messages";
import { ChatSession } from "./ChatSession";

export function ChatPanel() {
  const currentContext = useAppStore((s) => s.currentContext);
  const chatInputValue = useAppStore((s) => s.chatInputValue);
  const setChatInputValue = useAppStore((s) => s.setChatInputValue);

  const contextName =
    currentContext === "all"
      ? "General"
      : getTopicById(currentContext)?.name ?? "General";

  const injectedMessages = useAppStore((s) => s.injectedMessages);

  const topicId = currentContext === "all" ? "global" : currentContext;
  const staticMessages = getMessagesByTopic(topicId);
  const dynamicMessages = injectedMessages[topicId] ?? [];
  const messages = [...staticMessages, ...dynamicMessages];
  const sessions = groupMessagesBySessions(messages);

  const handleSubmit = useCallback(() => {
    setChatInputValue("");
  }, [setChatInputValue]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [currentContext, sessions.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="shrink-0 px-4 sm:px-6 py-4">
        <h2 className="text-base font-semibold truncate">{contextName}</h2>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {sessions.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted-foreground">
              暂无对话内容。点击右上角 Demo 入口，选择一个场景开始体验。
            </div>
          ) : (
            sessions.map((session, idx) => (
              <ChatSession
                key={session.date}
                session={session}
                isLatest={idx === sessions.length - 1}
              />
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 px-6 pb-5 pt-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-2 focus-within:border-accent/30 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
            <button
              type="button"
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              placeholder="Ask follow up question"
              value={chatInputValue}
              onChange={(e) => setChatInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none py-1"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shrink-0"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
