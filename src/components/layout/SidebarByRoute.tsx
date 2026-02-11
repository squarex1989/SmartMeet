"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { calendarEvents, getEventStatus } from "@/data/calendar";
import { advisors } from "@/data/advisors";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function SidebarByRoute() {
  const pathname = usePathname();
  const selectedDate = useAppStore((s) => s.selectedDate);
  const setSelectedDate = useAppStore((s) => s.setSelectedDate);
  const selectedEventId = useAppStore((s) => s.selectedEventId);
  const setSelectedEventId = useAppStore((s) => s.setSelectedEventId);
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const setActiveConversationId = useAppStore((s) => s.setActiveConversationId);
  const openDocumentId = useAppStore((s) => s.openDocumentId);

  const isCalendar = pathname.startsWith("/app/calendar") || pathname === "/app";
  const isChat = pathname.startsWith("/app/chat");
  const isDoc = pathname.startsWith("/app/doc");

  if (!isCalendar && !isChat && !isDoc) return null;

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-background flex flex-col overflow-hidden">
      {isCalendar && (
        <>
          <div className="border-b border-border p-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">日期</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 w-full rounded border border-border px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex-1 overflow-auto p-2">
            {calendarEvents
              .filter((e) => e.start.startsWith(selectedDate.slice(0, 10)))
              .map((ev) => {
                const advisor = advisors.find((a) => a.id === ev.advisorId);
                const isSelected = selectedEventId === ev.id;
                const status = getEventStatus(ev, `${selectedDate.slice(0, 10)}T14:30:00`);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEventId(ev.id)}
                    className={cn(
                      "mb-2 w-full rounded-lg border p-3 text-left transition",
                      isSelected ? "border-foreground/30 bg-muted" : "border-border hover:bg-muted/50",
                      status === "past" && "opacity-60"
                    )}
                  >
                    <p className={cn(
                      "text-sm font-medium",
                      status === "past" && "text-muted-foreground"
                    )}>
                      {ev.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{ev.start.slice(11, 16)} - {ev.end.slice(11, 16)}</span>
                      {status === "ongoing" && (
                        <span className="flex items-center gap-1">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600" />
                          </span>
                          <span className="text-green-700 dark:text-green-400 font-medium">进行中</span>
                        </span>
                      )}
                      {status === "past" && (
                        <span className="text-muted-foreground/70">已结束</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Organizer: {advisor?.name ?? "Unknown"}
                    </p>
                  </button>
                );
              })}
            {calendarEvents.filter((e) => e.start.startsWith(selectedDate.slice(0, 10))).length === 0 && (
              <p className="text-sm text-muted-foreground">暂无日程</p>
            )}
          </div>
        </>
      )}

      {isChat && (
        <>
          <div className="border-b border-border p-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">对话</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <ConversationItem
              variant="group"
              label="All Advisors"
              memberSummary="3 位成员: Alex, Jamie, Morgan"
              advisors={advisors}
              isActive={activeConversationId === "group"}
              onClick={() => setActiveConversationId("group")}
            />
            {advisors.map((a) => (
              <ConversationItem
                key={a.id}
                variant="single"
                label={a.name}
                tagline={a.tagline}
                advisor={a}
                isActive={activeConversationId === a.id}
                onClick={() => setActiveConversationId(a.id)}
              />
            ))}
          </div>
        </>
      )}

      {isDoc && (
        <>
          <div className="border-b border-border p-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">最近访问</h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {[
              "doc-meeting-notes-techvision",
              "doc-slides-techvision",
              "doc-proposal-techvision",
              "doc-report-cloudflow",
              "doc-agenda-retailmax",
              "doc-strategy-retailmax",
            ].map((id) => (
              <Link
                key={id}
                href={`/app/doc?id=${id}`}
                className={cn(
                  "block rounded-md px-2 py-2 text-sm transition",
                  openDocumentId === id ? "bg-muted font-medium" : "hover:bg-muted/50"
                )}
              >
                {id.includes("meeting") && "TechVision 需求访谈纪要"}
                {id.includes("slides") && "TechVision 产品定位 Deck"}
                {id.includes("proposal") && "TechVision Proposal"}
                {id.includes("report") && "CloudFlow 周报"}
                {id.includes("agenda") && "RetailMax 工作坊 Agenda"}
                {id.includes("strategy") && "RetailMax 营销策略"}
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

type AdvisorItem = { id: string; name: string; tagline: string; color: string };

function ConversationItem({
  variant,
  label,
  tagline,
  memberSummary,
  advisor,
  advisors,
  isActive,
  onClick,
}: {
  variant: "group" | "single";
  label: string;
  tagline?: string;
  memberSummary?: string;
  advisor?: AdvisorItem;
  advisors?: AdvisorItem[];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full border-b border-border px-3 py-3 text-left transition flex items-center gap-3",
        isActive ? "bg-muted" : "hover:bg-muted/50"
      )}
    >
      {variant === "group" && advisors && advisors.length > 0 && (
        <div className="relative shrink-0 flex items-center">
          {advisors.slice(0, 3).map((a, i) => (
            <div
              key={a.id}
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background"
              style={{
                marginLeft: i === 0 ? 0 : -6,
                borderColor: a.color,
                zIndex: 3 - i,
              }}
            >
              {a.name[0]}
            </div>
          ))}
        </div>
      )}
      {variant === "single" && advisor && (
        <div
          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0"
          style={{ border: `2px solid ${advisor.color}` }}
        >
          {advisor.name[0]}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{label}</p>
        {memberSummary && <p className="text-xs text-muted-foreground truncate">{memberSummary}</p>}
        {tagline && <p className="text-xs text-muted-foreground truncate">{tagline}</p>}
      </div>
    </button>
  );
}
