"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { HelpCircle, X } from "lucide-react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  placement: "bottom" | "right" | "left" | "top";
  /** If set, navigate here before showing this step */
  navigateTo?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-chat",
    title: "Command Room",
    description: "和你的 AI Advisor 团队对话、下达指令、查看进度。这是你的主要工作台。",
    placement: "bottom",
    navigateTo: "/app/chat",
  },
  {
    targetId: "tour-calendar",
    title: "Calendar",
    description: "查看日程安排，加入会议或选择文档参会模式。Advisor 会为每场会议提前做好准备。",
    placement: "bottom",
  },
  {
    targetId: "tour-doc",
    title: "Doc",
    description: "浏览和编辑 Advisor 自动生成的文档——会议纪要、Slides、提案等。",
    placement: "bottom",
  },
  {
    targetId: "tour-inbox",
    title: "Inbox",
    description: "处理 Advisor 等待你确认的任务，比如 CRM 更新、邮件发送等。",
    placement: "bottom",
  },
  {
    targetId: "tour-advisors",
    title: "Advisors",
    description: "查看和管理你的 AI Advisor 团队，调整他们的工作规则和知识库。",
    placement: "bottom",
  },
  {
    targetId: "tour-activity-log",
    title: "Activity Log",
    description: "实时查看 Advisor 的工作动态——他们正在分析什么、生成了什么、在等待你什么。",
    placement: "left",
    navigateTo: "/app/chat",
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TRANSITION = "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
const pad = 8;

function computeTooltip(rect: Rect, placement: TourStep["placement"]): React.CSSProperties {
  if (placement === "bottom") {
    return {
      top: rect.top + rect.height + pad + 8,
      left: Math.max(12, rect.left + rect.width / 2 - 160),
    };
  }
  if (placement === "left") {
    return {
      top: Math.max(12, rect.top),
      left: Math.max(12, rect.left - 340 - pad),
    };
  }
  if (placement === "right") {
    return {
      top: Math.max(12, rect.top),
      left: rect.left + rect.width + pad + 8,
    };
  }
  // top
  return {
    top: Math.max(12, rect.top - 160),
    left: Math.max(12, rect.left + rect.width / 2 - 160),
  };
}

function buildClipPath(rect: Rect): string {
  const l = rect.left - pad;
  const t = rect.top - pad;
  const r = rect.left + rect.width + pad;
  const b = rect.top + rect.height + pad;
  return `polygon(
    0% 0%, 0% 100%,
    ${l}px 100%, ${l}px ${t}px,
    ${r}px ${t}px, ${r}px ${b}px,
    ${l}px ${b}px, ${l}px 100%,
    100% 100%, 100% 0%
  )`;
}

/* ─── Tour hint toast shown after tour ends ─── */
export function TourHint() {
  const showTourHint = useAppStore((s) => s.showTourHint);
  const setShowTourHint = useAppStore((s) => s.setShowTourHint);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!showTourHint) return;
    const t = setTimeout(() => setShowTourHint(false), 8000);
    return () => clearTimeout(t);
  }, [showTourHint, setShowTourHint]);

  if (!showTourHint) return null;

  return (
    <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-start gap-3 rounded-xl border border-[#333] bg-[#1A1A1A] px-4 py-3 shadow-2xl max-w-xs">
        <HelpCircle className="h-5 w-5 text-white/70 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white leading-relaxed">
            随时点击右上角的 <span className="font-semibold text-white">Guide</span> 按钮重新查看引导
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTourHint(false)}
          className="text-[#888] hover:text-white transition shrink-0 mt-0.5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main tour component ─── */
export function GuidedTour() {
  const tourActive = useAppStore((s) => s.tourActive);
  const tourStep = useAppStore((s) => s.tourStep);
  const setTourActive = useAppStore((s) => s.setTourActive);
  const setTourStep = useAppStore((s) => s.setTourStep);
  const setShowTourHint = useAppStore((s) => s.setShowTourHint);
  const router = useRouter();
  const pathname = usePathname();

  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [navigating, setNavigating] = useState(false);
  // Text content fades independently
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

  // Navigate to page if needed
  useEffect(() => {
    if (!tourActive || !currentStep) return;
    if (currentStep.navigateTo && !pathname.startsWith(currentStep.navigateTo)) {
      setNavigating(true);
      router.push(currentStep.navigateTo);
    }
  }, [tourActive, tourStep, currentStep, pathname, router]);

  // On step change: fade text out, measure new target, then fade text in
  useEffect(() => {
    if (!tourActive) return;
    const needsNav = currentStep?.navigateTo && !pathname.startsWith(currentStep.navigateTo);

    if (prevStepRef.current !== tourStep) {
      // Fade out text
      setTextOpacity(0);
      const delay = needsNav ? 350 : 50;
      const timer = setTimeout(() => {
        measureTarget();
        setNavigating(false);
        setDisplayedStep(tourStep);
        // Fade text back in after the box has started moving
        setTimeout(() => setTextOpacity(1), 80);
      }, delay);
      prevStepRef.current = tourStep;
      return () => clearTimeout(timer);
    } else {
      // Initial mount or same step (e.g. after navigation)
      const timer = setTimeout(() => {
        measureTarget();
        setNavigating(false);
        setDisplayedStep(tourStep);
        setTextOpacity(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tourActive, tourStep, pathname, measureTarget, currentStep]);

  // Re-measure on window resize / scroll
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
  }, [setTourActive, setShowTourHint]);

  if (!tourActive || !currentStep) return null;

  const handleNext = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      endTour();
      router.push("/app/chat");
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleSkip = () => {
    endTour();
  };

  const isFirst = tourStep === 0;
  const isLast = tourStep === TOUR_STEPS.length - 1;

  // Tooltip position (uses current targetRect for smooth slide)
  const tooltipPos = targetRect ? computeTooltip(targetRect, currentStep.placement) : {};
  const clipPath = targetRect ? buildClipPath(targetRect) : undefined;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true">
      {/* Overlay with animated clip-path cutout */}
      <div
        className="absolute inset-0 pointer-events-auto bg-black/65"
        style={{
          clipPath: clipPath ?? "none",
          transition: `clip-path ${TRANSITION.split(" ").slice(1).join(" ")}`,
        }}
        onClick={handleSkip}
      />

      {/* Highlight border — slides smoothly */}
      {targetRect && (
        <div
          className="fixed border-2 border-white/40 rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - pad,
            left: targetRect.left - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
            transition: TRANSITION,
          }}
        />
      )}

      {/* Tooltip card — slides smoothly, text fades */}
      {targetRect && !navigating && (
        <div
          className="fixed z-[61] w-[320px] rounded-xl border border-[#333] bg-[#1A1A1A] p-4 shadow-2xl"
          style={{
            ...tooltipPos,
            transition: TRANSITION,
          }}
        >
          {/* Text content with fade */}
          <div
            style={{
              opacity: textOpacity,
              transition: "opacity 0.15s ease",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">{displayStep?.title}</h4>
              <span className="text-xs text-[#888] shrink-0 ml-2">
                {tourStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>
            <p className="text-sm text-[#aaa] leading-relaxed mb-4">
              {displayStep?.description}
            </p>
          </div>

          {/* Step dots + buttons (always visible) */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      i === tourStep
                        ? "white"
                        : i < tourStep
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(255,255,255,0.2)",
                    transition: "background-color 0.3s ease",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {!isFirst && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-md text-xs text-[#888] hover:text-white hover:bg-white/10 transition"
                >
                  上一步
                </button>
              )}
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 py-1.5 rounded-md text-xs text-[#888] hover:text-white hover:bg-white/10 transition"
              >
                跳过
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded-md text-xs font-medium bg-white text-black hover:bg-white/90 transition"
              >
                {isLast ? "完成" : "下一步"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
