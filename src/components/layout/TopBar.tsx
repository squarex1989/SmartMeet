"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, Layers, Settings, Menu, Zap, PanelRight, Play, ChevronDown, Check } from "lucide-react";
import { useAppStore, type MainView } from "@/store/useAppStore";
import { demoScenarios } from "@/data/demo-scenarios";
import { cn } from "@/lib/utils";

const views: { view: MainView; label: string; icon: React.ElementType }[] = [
  { view: "command-room", label: "Command Room", icon: MessageSquare },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "docs", label: "Works", icon: Layers },
  { view: "automations", label: "Playbook", icon: Zap },
];

function DemoDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeScenario = useAppStore((s) => s.activeScenario);
  const setActiveScenario = useAppStore((s) => s.setActiveScenario);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setMainView = useAppStore((s) => s.setMainView);
  const injectMessages = useAppStore((s) => s.injectMessages);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (scenario: (typeof demoScenarios)[number]) => {
    setActiveScenario(scenario.id);
    // Clear previously injected scenario messages then inject new ones
    const store = useAppStore.getState();
    const cleared: Record<string, never[]> = {};
    for (const key of Object.keys(store.injectedMessages)) {
      cleared[key] = [];
    }
    useAppStore.setState({ injectedMessages: cleared });

    const topicId = scenario.targetTopic;
    injectMessages(topicId, scenario.messages);

    setMainView("command-room");
    setCurrentContext(topicId === "global" ? "all" : topicId as never);
    setOpen(false);
  };

  const activeLabel = activeScenario
    ? demoScenarios.find((s) => s.id === activeScenario)?.label
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "interactive-base flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors",
          activeScenario
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border bg-surface-2 text-muted-foreground hover:text-foreground hover:border-accent/30"
        )}
      >
        <Play className="h-3 w-3" />
        <span className="hidden sm:inline">{activeLabel ?? "Demo"}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-lg border border-border bg-background shadow-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Hero Scenarios</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">选择要演示的场景</p>
          </div>
          <div className="py-1">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => handleSelect(scenario)}
                className={cn(
                  "flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors",
                  activeScenario === scenario.id && "bg-accent/5"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{scenario.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{scenario.description}</p>
                </div>
                {activeScenario === scenario.id && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TopBar() {
  const mainView = useAppStore((s) => s.mainView);
  const setMainView = useAppStore((s) => s.setMainView);
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const mobileWorkPanelOpen = useAppStore((s) => s.mobileWorkPanelOpen);
  const setMobileWorkPanelOpen = useAppStore((s) => s.setMobileWorkPanelOpen);

  return (
    <nav className="flex h-14 items-center bg-surface-2 text-foreground border-b border-border shrink-0">
      <div className="flex items-center gap-1 sm:gap-4 px-2 sm:px-4 w-full">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="interactive-base md:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/"
          className="interactive-base font-semibold tracking-tight shrink-0 text-foreground hover:text-accent hidden sm:block"
        >
          Command Room
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-1 min-w-0">
          {views.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              type="button"
              data-tour-id={`tour-view-${view}`}
              onClick={() => setMainView(view)}
              className={cn(
                "interactive-base flex items-center gap-1.5 rounded-md px-2 sm:px-3 py-2 text-sm font-medium shrink-0",
                mainView === view
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-3"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">
          <DemoDropdown />
          {mainView === "command-room" && (
            <button
              type="button"
              onClick={() => setMobileWorkPanelOpen(!mobileWorkPanelOpen)}
              className="interactive-base lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 rounded-md"
              aria-label="Toggle work panel"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="interactive-base p-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 rounded-md"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="interactive-base flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold ring-1 ring-border hover:ring-accent/40"
            aria-label="User avatar"
          >
            S
          </button>
        </div>
      </div>
    </nav>
  );
}
