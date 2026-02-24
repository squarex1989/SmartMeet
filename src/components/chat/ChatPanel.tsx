"use client";

import { useCallback, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getTopicById } from "@/data/topics";
import { getMessagesByTopic, groupMessagesBySessions } from "@/data/chat-messages";
import { ChatSession } from "./ChatSession";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatPanel() {
  const currentContext = useAppStore((s) => s.currentContext);
  const chatInputValue = useAppStore((s) => s.chatInputValue);
  const setChatInputValue = useAppStore((s) => s.setChatInputValue);

  const contextName =
    currentContext === "all"
      ? "All Work"
      : getTopicById(currentContext)?.name ?? "All Work";

  const topicId = currentContext === "all" ? "global" : currentContext;
  const messages = getMessagesByTopic(topicId);
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
    <div className="flex flex-col h-full">
      <header className="shrink-0 px-4 py-3 border-b border-border">
        <h2 className="text-sm font-medium">{contextName}</h2>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {sessions.map((session, idx) => (
          <ChatSession
            key={session.date}
            session={session}
            isLatest={idx === sessions.length - 1}
          />
        ))}
      </div>

      <div className="shrink-0 p-4 border-t border-border flex gap-2">
        <Input
          placeholder="Type a command..."
          value={chatInputValue}
          onChange={(e) => setChatInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSubmit}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
