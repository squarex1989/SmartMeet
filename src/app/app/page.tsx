"use client";

import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TopicNavigator } from "@/components/layout/TopicNavigator";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { WorkPanel } from "@/components/work-panel/WorkPanel";
import { ReviewOverlay } from "@/components/review/ReviewOverlay";
import { InsightsExpandedView } from "@/components/work-panel/InsightsExpandedView";
import { AutomationsManager } from "@/components/work-panel/AutomationsManager";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DocsView } from "@/components/docs/DocsView";

const MIN_PANEL_PX = 280;

function CommandRoomView() {
  const commandRoomOverlay = useAppStore((s) => s.commandRoomOverlay);
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const mobileWorkPanelOpen = useAppStore((s) => s.mobileWorkPanelOpen);
  const setMobileWorkPanelOpen = useAppStore((s) => s.setMobileWorkPanelOpen);

  const containerRef = useRef<HTMLDivElement>(null);
  const [wpWidth, setWpWidth] = useState<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const move = (ev: MouseEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const fromRight = rect.right - ev.clientX;
      const clamped = Math.max(MIN_PANEL_PX, Math.min(rect.width - MIN_PANEL_PX, fromRight));
      setWpWidth(clamped);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, []);

  const centerContent = (
    <>
      {commandRoomOverlay === null && <ChatPanel />}
      {commandRoomOverlay === "review" && <ReviewOverlay />}
      {commandRoomOverlay === "insights" && <InsightsExpandedView />}
    </>
  );

  return (
    <>
      <div className="hidden md:flex shrink-0">
        <TopicNavigator />
      </div>
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-y-14 left-0 z-50 w-64 max-w-[85vw] flex flex-col bg-background border-r border-border shadow-xl md:hidden">
            <TopicNavigator />
          </div>
        </>
      )}

      <div ref={containerRef} className="flex flex-1 min-w-0 h-full">
        {/* Desktop: resizable chat + work panel */}
        <div className="hidden lg:flex flex-1 min-w-0 h-full">
          <div className="flex-1 min-w-0 h-full" style={{ minWidth: MIN_PANEL_PX }}>
            {centerContent}
          </div>

          <div
            className="shrink-0 relative group cursor-col-resize select-none"
            style={{ width: 4 }}
            onMouseDown={handleMouseDown}
            role="separator"
            aria-orientation="vertical"
          >
            <div className="absolute inset-y-0 -left-1.5 -right-1.5 group-hover:bg-accent/10 transition-colors rounded" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border group-hover:bg-accent/40 transition-colors" />
          </div>

          <div
            className="shrink-0 h-full"
            style={{ width: wpWidth ?? "40%", minWidth: MIN_PANEL_PX }}
          >
            <WorkPanel />
          </div>
        </div>

        {/* Mobile/Tablet: chat only, work panel as overlay */}
        <div className="flex lg:hidden flex-1 min-w-0 h-full">
          {centerContent}
        </div>
      </div>

      {/* Mobile work panel overlay */}
      {mobileWorkPanelOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileWorkPanelOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 top-14 bg-background border-t border-border shadow-xl flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
              <span className="text-sm font-medium">Work Panel</span>
              <button
                type="button"
                onClick={() => setMobileWorkPanelOpen(false)}
                className="interactive-base p-1 text-muted-foreground hover:text-foreground rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <WorkPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AutomationsView() {
  return (
    <div className="flex flex-1 min-w-0 h-full">
      <AutomationsManager standalone />
    </div>
  );
}

export default function AppPage() {
  const mainView = useAppStore((s) => s.mainView);

  return (
    <>
      {mainView === "command-room" && <CommandRoomView />}
      {mainView === "calendar" && <CalendarView />}
      {mainView === "docs" && <DocsView />}
      {mainView === "automations" && <AutomationsView />}
    </>
  );
}
