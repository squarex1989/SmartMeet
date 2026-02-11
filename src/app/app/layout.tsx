"use client";

import { AppNav } from "@/components/layout/AppNav";
import { SidebarByRoute } from "@/components/layout/SidebarByRoute";
import { useAppStore } from "@/store/useAppStore";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);

  return (
    <div className="flex h-screen flex-col bg-[#FAFAFA]">
      <AppNav />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: inline sidebar */}
        <div className="hidden md:flex shrink-0">
          <SidebarByRoute onClose={undefined} />
        </div>
        {/* Mobile: drawer overlay */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden
            />
            <div className="fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] flex flex-col bg-background border-r border-border shadow-xl md:hidden">
              <SidebarByRoute onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </>
        )}
        <main className="flex-1 overflow-auto bg-background min-w-0">{children}</main>
      </div>
    </div>
  );
}
