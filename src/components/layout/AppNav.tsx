"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, MessageSquare, FileText, Inbox, Users, Video, FileEdit, X, Menu } from "lucide-react";
import { useAppStore, type AppTab } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { USER_AVATAR } from "@/data/advisors";

const tabs: { tab: AppTab; label: string; href: string; icon: React.ElementType }[] = [
  { tab: "chat", label: "Command Room", href: "/app/chat", icon: MessageSquare },
  { tab: "calendar", label: "Calendar", href: "/app/calendar", icon: Calendar },
  { tab: "doc", label: "Doc", href: "/app/doc", icon: FileText },
  { tab: "inbox", label: "Inbox", href: "/app/inbox", icon: Inbox },
  { tab: "advisors", label: "Advisors", href: "/app/advisors", icon: Users },
];

export function AppNav() {
  const pathname = usePathname();
  const inboxPendingCount = useAppStore((s) => s.inboxPendingCount);
  const activeMeetings = useAppStore((s) => s.activeMeetings);
  const removeActiveMeeting = useAppStore((s) => s.removeActiveMeeting);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);

  return (
    <nav className="flex h-14 items-center border-b border-border bg-[#111111] px-2 md:px-4 text-[#EDEDED] shrink-0">
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden p-2 -ml-1 mr-1 text-[#8A8A8A] hover:text-white"
        aria-label="打开侧边栏"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/app/calendar" className="mr-4 md:mr-8 flex items-center gap-2 font-semibold tracking-tight shrink-0">
        <span className="text-base md:text-lg">Shadow</span>
      </Link>
      <div className="flex gap-1 overflow-x-auto min-w-0 flex-1 md:flex-initial scrollbar-none">
        {tabs.map(({ tab, label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href) || (href === "/app/calendar" && pathname === "/app");
          return (
            <Link
              key={tab}
              href={href}
              className={cn(
                "relative flex items-center gap-2 rounded-md px-2 md:px-3 py-2 text-sm font-medium transition-colors shrink-0",
                isActive && !pathname.startsWith("/app/meeting")
                  ? "bg-white/10 text-white"
                  : "text-[#8A8A8A] hover:text-white hover:bg-white/5"
              )}
              title={label}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">{label}</span>
              {tab === "inbox" && inboxPendingCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {inboxPendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Active meeting tabs — compact on mobile */}
      {activeMeetings.length > 0 && (
        <div className="flex gap-1 ml-2 md:ml-3 pl-2 md:pl-3 border-l border-white/10 shrink-0 overflow-x-auto">
          {activeMeetings.map((m) => {
            const isActive = pathname.startsWith("/app/meeting") && new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("id") === m.id;
            const MeetingIcon = m.docMode ? FileEdit : Video;
            return (
              <div key={m.id} className="flex items-center shrink-0">
                <Link
                  href={m.href}
                  className={cn(
                    "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 text-sm font-medium transition-colors border",
                    m.ongoing ? "rounded-md" : "rounded-l-md",
                    isActive
                      ? "bg-green-600/20 border-green-500/40 text-green-400"
                      : "bg-white/5 border-white/10 text-[#8A8A8A] hover:text-white hover:bg-white/10"
                  )}
                  title={m.title}
                >
                  {m.ongoing && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                  )}
                  <MeetingIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="max-w-[80px] md:max-w-[120px] truncate hidden sm:inline">{m.title}</span>
                </Link>
                {!m.ongoing && (
                  <button
                    type="button"
                    onClick={() => removeActiveMeeting(m.id)}
                    className={cn(
                      "flex items-center justify-center h-full rounded-r-md px-1.5 py-1.5 border border-l-0 transition-colors",
                      isActive
                        ? "bg-green-600/20 border-green-500/40 text-green-400 hover:bg-red-600/30 hover:text-red-400"
                        : "bg-white/5 border-white/10 text-[#8A8A8A] hover:text-white hover:bg-white/10"
                    )}
                    title="关闭会议标签"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="rounded-full ring-2 ring-border transition hover:ring-[#6B6B6B] overflow-hidden"
          title="Sarah"
        >
          <Image src={USER_AVATAR} alt="Sarah" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        </button>
      </div>
    </nav>
  );
}
