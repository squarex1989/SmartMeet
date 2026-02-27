"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, Layers, Settings, Menu, Zap, PanelRight, Play, ChevronDown, Check, X } from "lucide-react";
import { useAppStore, type MainView } from "@/store/useAppStore";
import { demoScenarios } from "@/data/demo-scenarios";
import { cn } from "@/lib/utils";

const views: { view: MainView; label: string; icon: React.ElementType }[] = [
  { view: "command-room", label: "Command Room", icon: MessageSquare },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "docs", label: "Works", icon: Layers },
  { view: "automations", label: "Playbook", icon: Zap },
];

const DEMO_GUIDE_KEY = "shadow-demo-guide-dismissed";

function DemoDropdown() {
  const [open, setOpen] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setGuideVisible(!localStorage.getItem(DEMO_GUIDE_KEY));
    } catch {
      setGuideVisible(true);
    }
  }, []);

  const dismissGuide = () => {
    setGuideVisible(false);
    try {
      localStorage.setItem(DEMO_GUIDE_KEY, "1");
    } catch {}
  };
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
      {guideVisible && (
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 z-[60] flex items-center gap-2 rounded-xl bg-foreground text-background shadow-lg px-3 py-2 min-w-[140px]">
          <span className="text-xs flex-1">点击这里切换演示场景</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); dismissGuide(); }}
            className="shrink-0 p-0.5 rounded-md text-background/70 hover:text-background transition-colors"
            aria-label="关闭"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-foreground" />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors",
          activeScenario
            ? "border-accent/30 bg-accent/8 text-accent"
            : "border-border bg-surface-2 text-muted-foreground hover:text-foreground hover:border-accent/20"
        )}
      >
        <Play className="h-3 w-3" />
        <span className="hidden sm:inline">{activeLabel ?? "Demo"}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-border bg-background shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Hero Scenarios</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">选择要演示的场景</p>
          </div>
          <div className="py-1">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => handleSelect(scenario)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors",
                  activeScenario === scenario.id && "bg-accent/5"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{scenario.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{scenario.description}</p>
                </div>
                {activeScenario === scenario.id && (
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
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
    <nav className="flex h-14 items-center bg-background border-b border-border shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 w-full">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/"
          className="font-semibold tracking-tight shrink-0 text-foreground hover:text-accent transition-colors hidden sm:block"
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
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium shrink-0 transition-colors",
                mainView === view
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
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
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-lg transition-colors"
              aria-label="Toggle work panel"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-semibold">
            S
          </div>
        </div>
      </div>
    </nav>
  );
}
