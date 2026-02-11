"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAssistantById, type KnowledgeIndexType } from "@/data/assistants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Mail, Database, Video } from "lucide-react";

export default function AssistantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const assistant = getAssistantById(id as "alex" | "jamie" | "morgan");

  if (!assistant) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Assistant 不存在。</p>
        <Link href="/app/assistants" className="text-blue-600 hover:underline mt-2 inline-block">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <div
          className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold"
          style={{ border: `2px solid ${assistant.color}` }}
        >
          {assistant.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{assistant.name}</h1>
          <p className="text-muted-foreground">{assistant.tagline}</p>
          <p className="text-sm text-muted-foreground mt-1">{assistant.client} · {assistant.clientIndustry}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/app/chat")}>发消息</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h3 className="font-semibold">工作规划</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">自动化规则</p>
            {assistant.automationRules.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{r.description}</span>
                <span className="text-xs rounded bg-muted px-2 py-0.5">{r.enabled ? "启用" : "禁用"}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">定期任务</p>
            {assistant.recurringTasks.map((t) => (
              <p key={t.id} className="text-sm py-1">{t.description}</p>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">已知偏好</p>
            <ul className="list-disc pl-4 text-sm">
              {assistant.preferences.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold">记忆 / 知识索引</h3>
          <p className="text-sm text-muted-foreground">已索引 {assistant.indexedFilesCount} 个资源</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {assistant.knowledgeIndex.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm border-b border-border pb-4 last:border-0 last:pb-0">
                <span className="shrink-0 text-muted-foreground mt-0.5">
                  <KnowledgeIcon type={item.type} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground mt-0.5">{item.summary}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate" title={item.path}>{item.path}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/app/assistants" className="text-sm text-blue-600 hover:underline">← 返回 Assistants 列表</Link>
      </div>
    </div>
  );
}

function KnowledgeIcon({ type }: { type: KnowledgeIndexType }) {
  switch (type) {
    case "doc":
      return <FileText className="h-4 w-4" />;
    case "email":
      return <Mail className="h-4 w-4" />;
    case "crm":
      return <Database className="h-4 w-4" />;
    case "meeting":
      return <Video className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}
