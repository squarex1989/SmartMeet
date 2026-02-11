"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getMessagesForConversation } from "@/data/chats";
import { advisors } from "@/data/advisors";
import { ActivityLogPanel } from "@/components/activity-log/ActivityLogPanel";
import { AlexFollowupChat } from "@/components/chat/AlexFollowupChat";
import { Button } from "@/components/ui/button";
import { FileText, Presentation, FileCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

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
          <div className="flex-1 overflow-auto p-4 space-y-6">
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

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="rounded-lg px-3 py-2 text-sm bg-foreground text-background">
            {message.content.map((c, i) => {
              if (c.type === "text") return <p key={i} className="whitespace-pre-wrap">{c.text}</p>;
              return null;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* Avatar column */}
      {advisor && (
        <div
          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
          style={{ border: `2px solid ${advisor.color}` }}
        >
          {advisor.name[0]}
        </div>
      )}
      {/* Content column */}
      <div className="flex-1 min-w-0 max-w-[85%]">
        {advisor && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">{advisor.name}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[160px]">{advisor.tagline}</span>
          </div>
        )}
        <div className="rounded-lg px-3 py-2.5 text-sm bg-muted border border-border space-y-1">
          {message.content.map((c, i) => {
            if (c.type === "text") return <p key={i} className="whitespace-pre-wrap">{c.text}</p>;
            if (c.type === "doc_card" && c.docId) {
              const isSlides = c.docTitle?.toLowerCase().includes("deck") || c.docTitle?.toLowerCase().includes("slides");
              const isProposal = c.docTitle?.toLowerCase().includes("proposal");
              const DocIcon = isSlides ? Presentation : isProposal ? FileCheck : FileText;
              return (
                <Link
                  key={i}
                  href={`/app/doc?id=${c.docId}`}
                  className="group flex items-center gap-3 mt-2 px-3 py-2.5 rounded-lg border bg-background hover:bg-muted/60 transition"
                >
                  <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <DocIcon className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.docTitle}</p>
                    {c.pageCount && <p className="text-xs text-muted-foreground">{c.pageCount} 页</p>}
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition shrink-0" />
                </Link>
              );
            }
            if (c.type === "action_buttons" && c.buttons)
              return (
                <div key={i} className="flex gap-2 mt-3 flex-wrap">
                  {c.buttons.map((b, bi) => (
                    <Button
                      key={b.label}
                      variant={bi === c.buttons!.length - 1 ? "default" : "outline"}
                      size="sm"
                    >
                      {b.label}
                    </Button>
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

// (user bubble handled inline above)
