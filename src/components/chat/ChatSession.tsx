"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import type { ChatSession as ChatSessionType } from "@/data/chat-messages";
import { useAppStore } from "@/store/useAppStore";

interface ChatSessionProps {
  session: ChatSessionType;
  isLatest: boolean;
}

export function ChatSession({ session, isLatest }: ChatSessionProps) {
  const collapsedSessions = useAppStore((s) => s.collapsedSessions);
  const toggleSessionCollapse = useAppStore((s) => s.toggleSessionCollapse);

  const isExpanded = isLatest || collapsedSessions[session.date] === true;
  const isCollapsed = !isExpanded;

  const handleToggle = () => {
    if (!isLatest) {
      toggleSessionCollapse(session.date);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "text-center text-xs text-muted-foreground py-2",
          !isLatest && "cursor-pointer hover:text-foreground transition-colors",
          !isLatest && "flex items-center justify-center gap-2"
        )}
        onClick={!isLatest ? handleToggle : undefined}
      >
        <span className="bg-surface-2 rounded-full px-3 py-1">{session.label}</span>
        {!isLatest && (
          <span className="flex items-center gap-1 text-muted-foreground">
            ({session.messages.length} messages)
            {isCollapsed ? (
              <ChevronDown className="h-3 w-3 inline" />
            ) : (
              <ChevronUp className="h-3 w-3 inline" />
            )}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="space-y-4">
          {session.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
