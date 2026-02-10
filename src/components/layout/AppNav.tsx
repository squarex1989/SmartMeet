"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, MessageSquare, FileText, Inbox, Users } from "lucide-react";
import { useAppStore, type AppTab } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { USER_AVATAR } from "@/data/advisors";

const tabs: { tab: AppTab; label: string; href: string; icon: React.ElementType }[] = [
  { tab: "calendar", label: "Calendar", href: "/app/calendar", icon: Calendar },
  { tab: "chat", label: "Chat", href: "/app/chat", icon: MessageSquare },
  { tab: "doc", label: "Doc", href: "/app/doc", icon: FileText },
  { tab: "inbox", label: "Inbox", href: "/app/inbox", icon: Inbox },
  { tab: "advisors", label: "Advisors", href: "/app/advisors", icon: Users },
];

export function AppNav() {
  const pathname = usePathname();
  const inboxPendingCount = useAppStore((s) => s.inboxPendingCount);

  return (
    <nav className="flex h-14 items-center border-b border-border bg-[#111111] px-4 text-[#EDEDED]">
      <Link href="/app/calendar" className="mr-8 flex items-center gap-2 font-semibold tracking-tight">
        <span className="text-lg">SmartMeet</span>
      </Link>
      <div className="flex gap-1">
        {tabs.map(({ tab, label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href) || (href === "/app/calendar" && pathname === "/app");
          return (
            <Link
              key={tab}
              href={href}
              className={cn(
                "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-white/10 text-white" : "text-[#8A8A8A] hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {tab === "inbox" && inboxPendingCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {inboxPendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="ml-auto flex items-center gap-2">
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
