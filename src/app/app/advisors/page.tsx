"use client";

import Link from "next/link";
import { advisors } from "@/data/advisors";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdvisorsPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Advisors</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {advisors.map((a) => (
          <Link key={a.id} href={`/app/advisor/${a.id}`}>
            <Card className="hover:bg-muted/50 transition">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium"
                    style={{ border: `2px solid ${a.color}` }}
                  >
                    {a.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.tagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{a.client} · {a.clientIndustry}</p>
                <p className="mt-2">本周完成任务 {a.stats.tasksCompletedThisWeek} 个</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
