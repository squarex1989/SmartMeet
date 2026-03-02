"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { demoScenarios } from "@/data/demo-scenarios";

function extractLinesFromScenario(scenarioId: string): string[] {
  const scenario = demoScenarios.find((s) => s.id === scenarioId);
  if (!scenario) return [];
  const lines: string[] = [];
  for (const message of scenario.messages) {
    for (const c of message.content) {
      if (c.type === "text" && c.text) {
        lines.push(...c.text.split("\n").map((t) => t.trim()).filter(Boolean));
      }
      if (c.type === "status_update" && c.text) {
        lines.push(c.text);
      }
    }
  }
  return lines.slice(0, 80);
}

export function DemoDock() {
  const activeScenario = useAppStore((s) => s.activeScenario);
  const setActiveScenario = useAppStore((s) => s.setActiveScenario);
  const setCurrentContext = useAppStore((s) => s.setCurrentContext);
  const setMainView = useAppStore((s) => s.setMainView);
  const injectMessages = useAppStore((s) => s.injectMessages);
  const setDemoDocked = useAppStore((s) => s.setDemoDocked);

  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("点击播放，语音将朗读当前场景摘要。");
  const [playingScenario, setPlayingScenario] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlCache = useRef<Record<string, string>>({});

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const activeLines = useMemo(
    () => (activeScenario ? extractLinesFromScenario(activeScenario) : []),
    [activeScenario]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeLines.length) return;
    const onTime = () => {
      if (!audio.duration || !isFinite(audio.duration)) return;
      const idx = Math.min(
        activeLines.length - 1,
        Math.floor((audio.currentTime / audio.duration) * activeLines.length)
      );
      setSubtitle(activeLines[idx] ?? "");
    };
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [activeLines]);

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

  const playScenarioAudio = async () => {
    if (!activeScenario) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (playingScenario === activeScenario && audio.src) {
      await audio.play();
      setIsPlaying(true);
      return;
    }

    setIsLoadingAudio(true);
    try {
      let url = audioUrlCache.current[activeScenario];
      if (!url) {
        const textPayload = extractLinesFromScenario(activeScenario).slice(0, 24).join("\n");
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textPayload }),
        });
        if (!res.ok) throw new Error("tts failed");
        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        audioUrlCache.current[activeScenario] = url;
      }
      audio.src = url;
      setPlayingScenario(activeScenario);
      await audio.play();
      setIsPlaying(true);
    } catch {
      setSubtitle("语音生成失败，请检查 ElevenLabs key 或稍后重试。");
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="hidden lg:flex h-[180px] bg-[#0B0B0D] text-white border-t border-white/10 px-5 py-3 gap-4 items-stretch">
      <div className="w-[290px] shrink-0 flex flex-col justify-between">
        <div>
          <p className="text-sm mt-1 font-semibold text-white/95">切换 demo 演示</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playScenarioAudio}
            disabled={!activeScenario || isLoadingAudio}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 px-2.5 py-1.5 text-xs transition-colors"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isLoadingAudio ? "生成中..." : isPlaying ? "暂停" : "播放语音"}
          </button>
          <button
            type="button"
            onClick={() => setDemoDocked(false)}
            className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/15 px-2 py-1.5 text-xs text-white/80 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            退出常驻
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {demoScenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => activateScenario(s.id)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs border transition-colors",
                activeScenario === s.id
                  ? "bg-white text-black border-white"
                  : "bg-white/5 border-white/20 text-white/85 hover:bg-white/15"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white/85 min-h-[56px]">
          <span className="text-white/60 mr-2">字幕</span>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

