"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function AppSidebar({ children, className }: AppSidebarProps) {
  const pathname = usePathname();

  // Sidebar only shows for app routes that need context (calendar date, chat list, doc list)
  const showSidebar =
    pathname.startsWith("/app/calendar") ||
    pathname.startsWith("/app/chat") ||
    pathname.startsWith("/app/doc");

  if (!showSidebar) return null;

  return (
    <aside
      className={cn(
        "w-64 shrink-0 border-r border-border bg-background",
        className
      )}
    >
      {children}
    </aside>
  );
}
