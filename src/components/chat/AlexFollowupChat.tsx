"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { alexFollowupScript } from "@/data/followups";
import type { FollowupContent } from "@/data/followups";
import { advisors } from "@/data/advisors";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const alex = advisors.find((a) => a.id === "alex")!;

export function AlexFollowupChat() {
  const router = useRouter();
  const [displayedSteps, setDisplayedSteps] = useState<string[]>(["msg1"]);
  const [replies, setReplies] = useState<FollowupContent[][]>([]);
  const [loading, setLoading] = useState(false);

  const getStep = (id: string) => alexFollowupScript.find((s) => s.id === id);
  const currentStepId = displayedSteps[displayedSteps.length - 1];

  const handleAction = useCallback(
    (action: string) => {
      const step = getStep(currentStepId);
      const outcome = step?.onAction?.[action];
      if (!outcome) return;

      if (outcome.type === "reply") {
        setReplies((r) => [...r, outcome.replyContent]);
        const idx = alexFollowupScript.findIndex((s) => s.id === currentStepId);
        const next = alexFollowupScript[idx + 1];
        if (next) setDisplayedSteps((s) => [...s, next.id]);
      } else if (outcome.type === "navigate") {
        router.push(outcome.path);
      } else if (outcome.type === "advance") {
        if (outcome.nextStepId === "msg3_loading") {
          setLoading(true);
          setDisplayedSteps((s) => [...s, "msg3_loading"]);
          setTimeout(() => {
            setLoading(false);
            setDisplayedSteps((s) => [...s, "msg3_done"]);
          }, 1500);
        } else {
          setDisplayedSteps((s) => [...s, outcome.nextStepId]);
        }
      }
    },
    [currentStepId, router]
  );

  const flatMessages: ({ type: "step"; id: string } | { type: "reply"; content: FollowupContent[] })[] = [];
  for (let i = 0; i < displayedSteps.length; i++) {
    flatMessages.push({ type: "step", id: displayedSteps[i] });
    if (replies[i]) flatMessages.push({ type: "reply", content: replies[i] });
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedSteps.length, replies.length]);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {flatMessages.map((item, idx) => {
        if (item.type === "reply") {
          return (
            <div key={`reply-${idx}`} className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-foreground text-background px-3 py-2 text-sm">
                {item.content.map((c, i) => c.type === "text" && <p key={i}>{c.text}</p>)}
              </div>
            </div>
          );
        }
        const step = getStep(item.id);
        if (!step) return null;
        return (
          <div key={step.id} className="flex justify-start">
            <div className="max-w-[85%] space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs"
                  style={{ border: `2px solid ${alex.color}` }}
                >
                  {alex.name[0]}
                </div>
                <span className="text-sm font-medium">{alex.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">{alex.tagline}</span>
              </div>
              <div className="rounded-lg bg-muted border border-border px-3 py-2 text-sm">
                {step.content.map((c, i) => (
                  <ContentBlock key={i} content={c} />
                ))}
                {step.buttons && !loading && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {step.buttons.map((b) => (
                      <Button key={b.action} size="sm" variant="outline" onClick={() => handleAction(b.action)}>
                        {b.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {loading && (
        <div className="flex justify-start">
          <div className="rounded-lg bg-muted border px-3 py-2 text-sm text-muted-foreground">...</div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function ContentBlock({ content }: { content: FollowupContent }) {
  if (content.type === "text") return <p className="whitespace-pre-wrap">{content.text}</p>;
  if (content.type === "doc_card")
    return (
      <Link
        href={`/app/doc?id=${content.docId}`}
        className="block mt-2 p-2 rounded border bg-background text-sm font-medium hover:bg-muted/50"
      >
        📄 {content.docTitle}
        {content.pageCount != null && ` (${content.pageCount} 页)`}
      </Link>
    );
  if (content.type === "crm_preview")
    return (
      <div className="mt-2 rounded border p-2 text-xs space-y-1">
        {content.fields.map((f, i) => (
          <div key={i} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{f.name}</span>
            <span>{f.from} → {f.to}</span>
          </div>
        ))}
      </div>
    );
  if (content.type === "email_preview")
    return (
      <div className="mt-2 rounded border p-2 text-xs space-y-1">
        <p>收件人: {content.to}</p>
        <p>抄送: {content.cc}</p>
        <p>主题: {content.subject}</p>
        <p className="text-muted-foreground whitespace-pre-wrap mt-2">{content.body}</p>
      </div>
    );
  if (content.type === "quote")
    return (
      <blockquote className="border-l-2 border-muted-foreground/30 pl-2 my-1 text-muted-foreground italic text-xs">
        {content.speaker}: &ldquo;{content.text}&rdquo;
      </blockquote>
    );
  return null;
}
