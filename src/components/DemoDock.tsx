"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { demoScenarios } from "@/data/demo-scenarios";
import { getIntroForScenario } from "@/data/demo-scene-intros";

export function DemoDock() {
  const activeScenario = useAppStore((s) => s.activeScenario);
  const setActiveScenario = useAppStore((s) => s.setActiveScenario);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setMainView = useAppStore((s) => s.setMainView);
  const injectMessages = useAppStore((s) => s.injectMessages);

  const introText = useMemo(
    () =>
      activeScenario
        ? getIntroForScenario(activeScenario)
        : "请选择一个 demo 场景，查看并朗读对应介绍文案。",
    [activeScenario]
  );

  const activateScenario = (scenarioId: (typeof demoScenarios)[number]["id"]) => {
    const scenario = demoScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;
    setActiveScenario(scenario.id);
    const store = useAppStore.getState();
    const cleared: Record<string, never[]> = {};
    for (const key of Object.keys(store.injectedMessages)) {
      cleared[key] = [];
    }
    useAppStore.setState({ injectedMessages: cleared, reviewItemStatuses: {} });

    const topicId = scenario.targetTopic;
    injectMessages(topicId, scenario.messages);
    setMainView("command-room");
    setCurrentContext(topicId === "global" ? "all" : (topicId as never));
  };

  return (
    <div className="hidden lg:flex h-[180px] bg-[#0B0B0D] text-white border-t border-white/10 px-5 py-3">
      <div className="min-w-0 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {demoScenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => activateScenario(s.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm border transition-colors",
                activeScenario === s.id
                  ? "bg-white text-black border-white"
                  : "bg-white/5 border-white/20 text-white/85 hover:bg-white/15"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm leading-6 text-white/90 min-h-[92px]">
          {introText}
        </div>
      </div>
    </div>
  );
}

