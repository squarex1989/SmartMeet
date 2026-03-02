"use client";

import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import type { ChatSession as ChatSessionType } from "@/data/chat-messages";

interface ChatSessionProps {
  session: ChatSessionType;
  isLatest: boolean;
}

export function ChatSession({ session, isLatest }: ChatSessionProps) {
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "text-center text-xs text-muted-foreground py-2",
          !isLatest && "flex items-center justify-center gap-2"
        )}
      >
        <span className="bg-surface-2 rounded-full px-3 py-1">{session.label}</span>
        {!isLatest && (
          <span className="flex items-center gap-1 text-muted-foreground">
            ({session.messages.length} messages)
          </span>
        )}
      </div>
      <div className="space-y-4">
        {session.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
