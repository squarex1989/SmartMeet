"use client";

import Link from "next/link";
import { MessageSquare, Calendar, Layers, Settings, Menu, Zap, PanelRight } from "lucide-react";
import { useAppStore, type MainView } from "@/store/useAppStore";
import { DemoDropdown } from "@/components/DemoDropdown";
import { cn } from "@/lib/utils";

const views: { view: MainView; label: string; icon: React.ElementType }[] = [
  { view: "command-room", label: "Command Room", icon: MessageSquare },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "docs", label: "Works", icon: Layers },
  { view: "automations", label: "Playbook", icon: Zap },
];

export function TopBar() {
  const mainView = useAppStore((s) => s.mainView);
  const setMainView = useAppStore((s) => s.setMainView);
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const mobileWorkPanelOpen = useAppStore((s) => s.mobileWorkPanelOpen);
  const setMobileWorkPanelOpen = useAppStore((s) => s.setMobileWorkPanelOpen);

  return (
    <nav className="flex h-16 items-center bg-transparent shrink-0 px-2 md:px-4">
      <div className="flex h-[50px] items-center gap-2 sm:gap-4 px-3 sm:px-5 w-full rounded-2xl bg-white/90 border border-orange-100/60 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-2 -ml-1 text-stone-500 hover:text-stone-800 rounded-xl transition-colors hover:bg-orange-100/50"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/"
          className="font-semibold tracking-tight shrink-0 text-stone-800 hover:text-orange-600 transition-colors hidden sm:block"
        >
          Shadow
        </Link>
        <div className="flex items-center gap-1 flex-1 min-w-0 ml-2">
          {views.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              type="button"
              data-tour-id={`tour-view-${view}`}
              onClick={() => setMainView(view)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium shrink-0 transition-colors",
                mainView === view
                  ? "bg-orange-100/70 text-orange-600 font-semibold"
                  : "text-stone-500 hover:bg-orange-100/50 hover:text-stone-800"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <DemoDropdown />
          {mainView === "command-room" && (
            <button
              type="button"
              onClick={() => setMobileWorkPanelOpen(!mobileWorkPanelOpen)}
              className="lg:hidden p-2 text-stone-500 hover:text-stone-800 hover:bg-orange-100/50 rounded-xl transition-colors"
              aria-label="Toggle work panel"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-orange-100/50 rounded-xl transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-semibold">
            S
          </div>
        </div>
      </div>
    </nav>
  );
}
