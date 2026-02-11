"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { getDocumentMeta, getDocumentContent, documentsMeta } from "@/data/documents";
import { assistants } from "@/data/assistants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function DocPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const trackChanges = searchParams.get("trackChanges") === "1";
  const setOpenDocumentId = useAppStore((s) => s.setOpenDocumentId);

  useEffect(() => {
    if (id) setOpenDocumentId(id);
  }, [id, setOpenDocumentId]);

  const meta = id ? getDocumentMeta(id) : null;
  const content = id ? getDocumentContent(id) : null;
  const assistant = meta ? assistants.find((a) => a.id === meta.assistantId) : null;

  if (!id) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">在左侧选择文档，或从 Chat 中打开。</p>
        <div className="mt-4 space-y-2">
          {documentsMeta.slice(0, 6).map((d) => (
            <Link key={d.id} href={`/app/doc?id=${d.id}`} className="block text-sm text-blue-600 hover:underline">
              {d.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">文档不存在。</p>
      </div>
    );
  }

  let body = content.body;
  if (trackChanges && content.trackChanges && content.trackChanges.length > 0) {
    body = content.body; // Could apply track change highlights here
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/app/chat" className="text-sm text-muted-foreground hover:underline">
            返回对话
          </Link>
          <span className="text-muted-foreground">|</span>
          <h1 className="font-semibold">{meta?.title}</h1>
          {assistant && (
            <span className="text-xs text-muted-foreground" style={{ borderLeft: `2px solid ${assistant.color}`, paddingLeft: 8 }}>
              {assistant.name}
            </span>
          )}
        </div>
        {trackChanges && (
          <div className="flex gap-2">
            <Button size="sm">全部接受</Button>
            <Button size="sm" variant="outline">全部拒绝</Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-sm max-w-none">
          {body.split("\n").map((line, i) => (
            <p key={i} className="whitespace-pre-wrap text-sm">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DocPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">加载中...</div>}>
      <DocPageContent />
    </Suspense>
  );
}
