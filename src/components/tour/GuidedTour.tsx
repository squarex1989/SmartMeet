"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { HelpCircle, X } from "lucide-react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  placement: "bottom" | "right" | "left" | "top";
  action?: () => void;
}

function getTourSteps(): TourStep[] {
  return [
    {
      targetId: "tour-view-command-room",
      title: "Command Room",
      description: "和 Shadow 对话、下达指令、查看工作状态。这是你的主要工作台。",
      placement: "bottom",
      action: () => useAppStore.getState().setMainView("command-room"),
    },
    {
      targetId: "tour-view-calendar",
      title: "Calendar",
      description: "查看日程安排和每场会议的准备状态与产出。",
      placement: "bottom",
      action: () => useAppStore.getState().setMainView("calendar"),
    },
    {
      targetId: "tour-view-docs",
      title: "Docs",
      description: "浏览和编辑 Shadow 自动生成的文档——会议纪要、Slides、提案等。支持导出到 Google Docs 和 Word。",
      placement: "bottom",
      action: () => useAppStore.getState().setMainView("docs"),
    },
  ];
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TRANSITION = "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
const pad = 8;

function computeTooltip(rect: Rect, placement: TourStep["placement"]): React.CSSProperties {
  if (placement === "bottom") return { top: rect.top + rect.height + pad + 8, left: Math.max(12, rect.left + rect.width / 2 - 160) };
  if (placement === "left") return { top: Math.max(12, rect.top), left: Math.max(12, rect.left - 340 - pad) };
  if (placement === "right") return { top: Math.max(12, rect.top), left: rect.left + rect.width + pad + 8 };
  return { top: Math.max(12, rect.top - 160), left: Math.max(12, rect.left + rect.width / 2 - 160) };
}

function buildClipPath(rect: Rect): string {
  const l = rect.left - pad;
  const t = rect.top - pad;
  const r = rect.left + rect.width + pad;
  const b = rect.top + rect.height + pad;
  return `polygon(0% 0%, 0% 100%, ${l}px 100%, ${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px, ${l}px 100%, 100% 100%, 100% 0%)`;
}

export function TourHint() {
  const showTourHint = useAppStore((s) => s.showTourHint);
  const setShowTourHint = useAppStore((s) => s.setShowTourHint);

  useEffect(() => {
    if (!showTourHint) return;
    const t = setTimeout(() => setShowTourHint(false), 8000);
    return () => clearTimeout(t);
  }, [showTourHint, setShowTourHint]);

  if (!showTourHint) return null;

  return (
    <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-lg max-w-xs">
        <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed flex-1">
          随时点击右上角的 <span className="font-semibold">Guide</span> 按钮重新查看引导
        </p>
        <button type="button" onClick={() => setShowTourHint(false)} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function GuidedTour() {
  const tourActive = useAppStore((s) => s.tourActive);
  const tourStep = useAppStore((s) => s.tourStep);
  const setTourActive = useAppStore((s) => s.setTourActive);
  const setTourStep = useAppStore((s) => s.setTourStep);
  const setShowTourHint = useAppStore((s) => s.setShowTourHint);

  const TOUR_STEPS = getTourSteps();
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [textOpacity, setTextOpacity] = useState(1);
  const [displayedStep, setDisplayedStep] = useState(tourStep);
  const prevStepRef = useRef(tourStep);

  const currentStep = TOUR_STEPS[tourStep];
  const displayStep = TOUR_STEPS[displayedStep];

  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(`[data-tour-id="${currentStep.targetId}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
  }, [currentStep]);

  useEffect(() => {
    if (!tourActive || !currentStep) return;
    currentStep.action?.();
    const timer = setTimeout(() => {
      measureTarget();
      setDisplayedStep(tourStep);
      setTextOpacity(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [tourActive, tourStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!tourActive) return;
    if (prevStepRef.current !== tourStep) {
      setTextOpacity(0);
      const timer = setTimeout(() => {
        measureTarget();
        setDisplayedStep(tourStep);
        setTimeout(() => setTextOpacity(1), 80);
      }, 50);
      prevStepRef.current = tourStep;
      return () => clearTimeout(timer);
    }
  }, [tourActive, tourStep, measureTarget]);

  useEffect(() => {
    if (!tourActive) return;
    const handler = () => measureTarget();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [tourActive, measureTarget]);

  const endTour = useCallback(() => {
    setTourActive(false);
    setShowTourHint(true);
    useAppStore.getState().setMainView("command-room");
  }, [setTourActive, setShowTourHint]);

  if (!tourActive || !currentStep) return null;

  const handleNext = () => {
    if (tourStep < TOUR_STEPS.length - 1) setTourStep(tourStep + 1);
    else endTour();
  };

  const handlePrev = () => {
    if (tourStep > 0) setTourStep(tourStep - 1);
  };

  const isFirst = tourStep === 0;
  const isLast = tourStep === TOUR_STEPS.length - 1;
  const tooltipPos = targetRect ? computeTooltip(targetRect, currentStep.placement) : {};
  const clipPath = targetRect ? buildClipPath(targetRect) : undefined;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true">
      <div
        className="absolute inset-0 pointer-events-auto bg-black/65"
        style={{ clipPath: clipPath ?? "none", transition: `clip-path ${TRANSITION.split(" ").slice(1).join(" ")}` }}
        onClick={endTour}
      />
      {targetRect && (
        <div
          className="fixed border-2 border-white/40 rounded-xl pointer-events-none"
          style={{ top: targetRect.top - pad, left: targetRect.left - pad, width: targetRect.width + pad * 2, height: targetRect.height + pad * 2, transition: TRANSITION }}
        />
      )}
      {targetRect && (
        <div className="fixed z-[61] w-[320px] rounded-xl border border-border bg-background p-4 shadow-lg" style={{ ...tooltipPos, transition: TRANSITION }}>
          <div style={{ opacity: textOpacity, transition: "opacity 0.15s ease" }}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">{displayStep?.title}</h4>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">{tourStep + 1} / {TOUR_STEPS.length}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{displayStep?.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: i === tourStep ? "var(--accent)" : i < tourStep ? "var(--accent)" : "var(--border)" , opacity: i <= tourStep ? 1 : 0.5 }} />
              ))}
            </div>
            <div className="flex gap-2">
              {!isFirst && (
                <button type="button" onClick={handlePrev} className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-3">上一步</button>
              )}
              <button type="button" onClick={endTour} className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-3">跳过</button>
              <button type="button" onClick={handleNext} className="px-4 py-1.5 rounded-md text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90">{isLast ? "完成" : "下一步"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
