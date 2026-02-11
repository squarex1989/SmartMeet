"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getMessagesForConversation } from "@/data/chats";
import { advisors } from "@/data/advisors";
import { ActivityLogPanel } from "@/components/activity-log/ActivityLogPanel";
import { AlexFollowupChat } from "@/components/chat/AlexFollowupChat";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const setActiveConversationId = useAppStore((s) => s.setActiveConversationId);
  const mobileLogOpen = useAppStore((s) => s.mobileLogOpen);
  const setMobileLogOpen = useAppStore((s) => s.setMobileLogOpen);

  // Default to group when none selected
  useEffect(() => {
    if (activeConversationId === null) {
      setActiveConversationId("group");
    }
  }, [activeConversationId, setActiveConversationId]);

  const conversationId = activeConversationId ?? "group";
  const messages = getMessagesForConversation(conversationId);
  const isAlex = conversationId === "alex";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAlex) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isAlex, messages.length]);

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex md:hidden items-center justify-end px-3 py-2 border-b border-border shrink-0">
          <Button variant="outline" size="sm" onClick={() => setMobileLogOpen(true)}>
            Activity Log
          </Button>
        </div>
        {isAlex ? (
          <AlexFollowupChat />
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        {!isAlex && (
          <div className="border-t border-border p-4">
            <textarea
              placeholder="输入消息..."
              rows={5}
              className="w-full min-h-0 max-h-[12rem] resize-none rounded-md border border-border bg-background px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
              }}
            />
            <Button className="mt-2" size="sm">发送</Button>
          </div>
        )}
      </div>
      <ActivityLogPanel className="hidden md:flex" />
      {mobileLogOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileLogOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] flex flex-col bg-background border-l border-border shadow-xl md:hidden">
            <ActivityLogPanel onClose={() => setMobileLogOpen(false)} className="flex-1 min-h-0" />
          </div>
        </>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: (ReturnType<typeof getMessagesForConversation>[0]) }) {
  const isUser = message.role === "user";
  const advisor = message.advisorId ? advisors.find((a) => a.id === message.advisorId) : null;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] space-y-1", isUser ? "order-2" : "order-1")}>
        {advisor && (
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
        )}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isUser ? "bg-foreground text-background" : "bg-muted border border-border"
          )}
        >
          {message.content.map((c, i) => {
            if (c.type === "text") return <p key={i} className="whitespace-pre-wrap">{c.text}</p>;
            if (c.type === "doc_card" && c.docId)
              return (
                <Link key={i} href={`/app/doc?id=${c.docId}`} className="block mt-2 p-2 rounded border bg-background text-sm font-medium hover:bg-muted/50">
                  📄 {c.docTitle}
                </Link>
              );
            if (c.type === "action_buttons" && c.buttons)
              return (
                <div key={i} className="flex gap-2 mt-2 flex-wrap">
                  {c.buttons.map((b) => (
                    <Button key={b.label} variant="outline" size="sm">{b.label}</Button>
                  ))}
                </div>
              );
            if (c.type === "transcript_quote" && c.quote)
              return (
                <blockquote key={i} className="border-l-2 border-muted-foreground/30 pl-2 my-1 text-muted-foreground italic text-xs">
                  {c.quote.speaker}: &ldquo;{c.quote.text}&rdquo;
                </blockquote>
              );
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
