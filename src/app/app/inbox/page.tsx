"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const inboxItems = [
  { id: "1", from: "Alex", title: "CRM 更新请求", status: "pending", preview: "TechVision 客户阶段、联系人等" },
  { id: "2", from: "Alex", title: "Proposal 修改", status: "pending", preview: "定价方案需 review" },
  { id: "3", from: "Alex", title: "邮件发送确认", status: "pending", preview: "竞品分析数据 - 技术团队" },
  { id: "4", from: "Morgan", title: "CloudFlow 周报邮件", status: "pending", preview: "周报待确认发送" },
];

export default function InboxPage() {
  const setInboxPendingCount = useAppStore((s) => s.setInboxPendingCount);
  const setActiveConversationId = useAppStore((s) => s.setActiveConversationId);

  const handleResolve = (from: string) => {
    setInboxPendingCount(useAppStore.getState().inboxPendingCount - 1);
    setActiveConversationId(from === "Morgan" ? "morgan" : "alex");
    // In real app would mark item resolved
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">待办</h2>
      <p className="text-sm text-muted-foreground mb-6">Assistant 等待你确认的操作</p>
      <div className="space-y-4">
        {inboxItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.from} · {item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.preview}</p>
                </div>
                <span className="text-xs rounded bg-amber-100 text-amber-800 px-2 py-0.5">待确认</span>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href={item.from === "Morgan" ? "/app/chat" : "/app/chat"}>
                <Button size="sm" variant="outline" onClick={() => handleResolve(item.from)}>
                  跳转到对话
                </Button>
              </Link>
              <Button size="sm" onClick={() => handleResolve(item.from)}>确认</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
