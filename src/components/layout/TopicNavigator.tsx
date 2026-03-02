"use client";

import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { topics } from "@/data/topics";
import type { TopicType, TopicId } from "@/data/topics";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { NewTopicDialog } from "./NewTopicDialog";
import {
  getScenarioPendingByTopic,
  getScenarioPendingTotal,
} from "@/data/demo-datasets";

const SECTION_CONFIG: { type: TopicType; label: string }[] = [
  { type: "client", label: "CLIENTS" },
  { type: "project", label: "PROJECTS" },
  { type: "goal", label: "GOALS" },
];

function usePendingCounts() {
  const activeScenario = useAppStore((s) => s.activeScenario);

  const byTopic = (topicId: TopicId) =>
    getScenarioPendingByTopic(activeScenario, topicId);

  const total = getScenarioPendingTotal(activeScenario);

  return { byTopic, total };
}

export function TopicNavigator() {
  const currentContext = useAppStore((s) => s.currentContext);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const [sectionCollapsed, setSectionCollapsed] = useState<Record<TopicType, boolean>>({
    client: false,
    project: false,
    goal: false,
  });
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  const { byTopic, total } = usePendingCounts();

  const selectContext = (ctx: "all" | TopicId) => {
    setCurrentContext(ctx);
    setMobileSidebarOpen(false);
  };

  const toggleSection = (type: TopicType) => {
    setSectionCollapsed((c) => ({ ...c, [type]: !c[type] }));
  };

  const getTopicsByType = (type: TopicType) =>
    topics.filter((t) => t.type === type);

  return (
    <aside className="w-60 h-full bg-transparent flex flex-col shrink-0 p-4">
      <div className="py-1">
        <button
          type="button"
          onClick={() => selectContext("all")}
          className={cn(
            "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors",
            currentContext === "all"
              ? "bg-white shadow-sm text-orange-600 font-semibold"
              : "text-stone-500 hover:bg-orange-100/50 hover:text-stone-800"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="flex-1">General</span>
          {total > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-medium tabular-nums text-stone-500">
              {total}
            </span>
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTION_CONFIG.map(({ type, label }) => {
          const items = getTopicsByType(type);
          const isCollapsed = sectionCollapsed[type];
          return (
            <div key={type} className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection(type)}
                className="flex items-center w-full px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-500 transition-colors"
              >
                {label}
              </button>
              {!isCollapsed &&
                items.map((topic) => {
                  const isActive = currentContext === topic.id;
                  const pending = byTopic(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => selectContext(topic.id)}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors",
                        isActive
                          ? "bg-white shadow-sm text-orange-600 font-semibold"
                          : "text-stone-500 hover:bg-orange-100/50 hover:text-stone-800"
                      )}
                    >
                      <span className="text-base shrink-0" aria-hidden>
                        {topic.icon}
                      </span>
                      <span className="flex-1 truncate">{topic.name}</span>
                      {pending > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-100 px-1.5 text-[10px] font-medium tabular-nums text-orange-600">
                          {pending}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </nav>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setNewTopicOpen(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-orange-100/50 hover:text-stone-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Topic
        </button>
      </div>
      <NewTopicDialog open={newTopicOpen} onClose={() => setNewTopicOpen(false)} />
    </aside>
  );
}
