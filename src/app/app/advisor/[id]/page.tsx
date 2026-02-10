"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAdvisorById } from "@/data/advisors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const advisor = getAdvisorById(id as "alex" | "jamie" | "morgan");

  if (!advisor) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Advisor 不存在。</p>
        <Link href="/app/advisors" className="text-blue-600 hover:underline mt-2 inline-block">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <div
          className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold"
          style={{ border: `2px solid ${advisor.color}` }}
        >
          {advisor.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{advisor.name}</h1>
          <p className="text-muted-foreground">{advisor.tagline}</p>
          <p className="text-sm text-muted-foreground mt-1">{advisor.client} · {advisor.clientIndustry}</p>
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
            {advisor.automationRules.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{r.description}</span>
                <span className="text-xs rounded bg-muted px-2 py-0.5">{r.enabled ? "启用" : "禁用"}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">定期任务</p>
            {advisor.recurringTasks.map((t) => (
              <p key={t.id} className="text-sm py-1">{t.description}</p>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">已知偏好</p>
            <ul className="list-disc pl-4 text-sm">
              {advisor.preferences.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold">记忆 / 知识索引</h3>
          <p className="text-sm text-muted-foreground">已索引 {advisor.indexedFilesCount} 个文件</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">该 Advisor 已建立项目文件索引，可快速检索与引用。</p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/app/advisors" className="text-sm text-blue-600 hover:underline">← 返回 Advisors 列表</Link>
      </div>
    </div>
  );
}
