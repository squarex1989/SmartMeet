"use client";

import { useAppStore } from "@/store/useAppStore";
import { getEventById, getEventStatus } from "@/data/calendar";
import { advisors } from "@/data/advisors";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CalendarPage() {
  const selectedEventId = useAppStore((s) => s.selectedEventId);
  const selectedEvent = selectedEventId ? getEventById(selectedEventId) : null;

  return (
    <div className="h-full overflow-auto p-6">
      {selectedEvent ? (
        <EventDetailPanel event={selectedEvent} />
      ) : (
        <p className="text-muted-foreground">在左侧选择日期和会议查看详情</p>
      )}
    </div>
  );
}

function EventDetailPanel({ event }: { event: NonNullable<ReturnType<typeof getEventById>> }) {
  const advisor = advisors.find((a) => a.id === event.advisorId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-sm text-muted-foreground">
            {event.start.slice(0, 16).replace("T", " ")} - {event.end.slice(11, 16)}
          </p>
          {advisor && (
            <div className="flex items-center gap-2 mt-2">
              <div
                className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs"
                style={{ border: `2px solid ${advisor.color}` }}
              >
                {advisor.name[0]}
              </div>
              <span className="text-sm">{advisor.name}</span>
              <span className="text-xs text-muted-foreground">{advisor.tagline}</span>
            </div>
          )}
        </div>
        {!event.isPast && (
          <div className="flex flex-col gap-2 shrink-0">
            <Link href={`/app/meeting?id=${event.id}`}>
              <Button className="w-full">加入会议</Button>
            </Link>
            {getEventStatus(event, "2026-02-09T14:30:00") === "ongoing" && (
              <Link href={`/app/meeting?id=${event.id}&mode=doc`}>
                <Button variant="outline" className="w-full">文档参会</Button>
              </Link>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {event.isPast && event.outcome && (
          <>
            <section>
              <h3 className="text-sm font-medium mb-2">会后产出</h3>
              {event.outcome.summaryDocId && (
                <Link
                  href={`/app/doc?id=${event.outcome.summaryDocId}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  会议纪要
                </Link>
              )}
              <p className="text-sm text-muted-foreground">
                CRM 已更新 · 邮件已发送
              </p>
            </section>
            <section>
              <h3 className="text-sm font-medium mb-2">Follow-up 任务</h3>
              <ul className="space-y-1 text-sm">
                {event.outcome.followUpTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2">
                    <span>{t.status === "done" ? "✅" : "🔄"}</span>
                    {t.label}
                    {t.linkDocId && (
                      <Link href={`/app/doc?id=${t.linkDocId}`} className="text-blue-600 hover:underline">查看</Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
        {!event.isPast && event.prep && (
          <>
            <section>
              <h3 className="text-sm font-medium mb-2">客户信息摘要</h3>
              <p className="text-sm text-muted-foreground">{event.prep.clientSummary}</p>
            </section>
            <section>
              <h3 className="text-sm font-medium mb-2">推荐问题</h3>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                {event.prep.recommendedQuestions.map((q, i) => (
                  <li key={i}>{q.question}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-medium mb-2">开场白草稿</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.prep.openingScript}</p>
              <Button variant="outline" size="sm" className="mt-2">复制</Button>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
