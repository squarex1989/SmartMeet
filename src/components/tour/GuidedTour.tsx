"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

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

export function GuidedTour() {
  const tourActive = useAppStore((s) => s.tourActive);
  const tourStep = useAppStore((s) => s.tourStep);
  const setTourActive = useAppStore((s) => s.setTourActive);
  const setTourStep = useAppStore((s) => s.setTourStep);
  const router = useRouter();
  const pathname = usePathname();

  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [navigating, setNavigating] = useState(false);

  const currentStep = TOUR_STEPS[tourStep];

  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(`[data-tour-id="${currentStep.targetId}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setTargetRect(null);
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

  // After navigation or step change, measure the target
  useEffect(() => {
    if (!tourActive) return;
    // Use a short delay to allow page to render after navigation
    const timer = setTimeout(() => {
      measureTarget();
      setNavigating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [tourActive, tourStep, pathname, measureTarget]);

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

  if (!tourActive || !currentStep) return null;

  const handleNext = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      // Tour complete — go to Command Room
      setTourActive(false);
      router.push("/app/chat");
    }
  };

  const handleSkip = () => {
    setTourActive(false);
  };

  const isLast = tourStep === TOUR_STEPS.length - 1;
  const pad = 8; // padding around highlighted element

  // Tooltip positioning
  let tooltipStyle: React.CSSProperties = {};
  if (targetRect) {
    const { placement } = currentStep;
    if (placement === "bottom") {
      tooltipStyle = {
        top: targetRect.top + targetRect.height + pad + 8,
        left: Math.max(12, targetRect.left + targetRect.width / 2 - 160),
      };
    } else if (placement === "left") {
      tooltipStyle = {
        top: Math.max(12, targetRect.top),
        left: Math.max(12, targetRect.left - 340 - pad),
      };
    } else if (placement === "right") {
      tooltipStyle = {
        top: Math.max(12, targetRect.top),
        left: targetRect.left + targetRect.width + pad + 8,
      };
    } else if (placement === "top") {
      tooltipStyle = {
        top: Math.max(12, targetRect.top - 160),
        left: Math.max(12, targetRect.left + targetRect.width / 2 - 160),
      };
    }
  }

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true">
      {/* Overlay with transparent cutout via box-shadow */}
      {targetRect && !navigating ? (
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.65)`,
            top: targetRect.top - pad,
            left: targetRect.left - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
            borderRadius: 8,
            position: "fixed",
          }}
          onClick={handleSkip}
        />
      ) : (
        <div className="absolute inset-0 bg-black/65" onClick={handleSkip} />
      )}

      {/* Highlighted area — let clicks pass through to the overlay */}
      {targetRect && !navigating && (
        <div
          className="fixed border-2 border-white/40 rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - pad,
            left: targetRect.left - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
          }}
        />
      )}

      {/* Tooltip card */}
      {targetRect && !navigating && (
        <div
          className="fixed z-[61] w-[320px] rounded-xl border border-[#333] bg-[#1A1A1A] p-4 shadow-2xl"
          style={tooltipStyle}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-white">{currentStep.title}</h4>
            <span className="text-xs text-[#888] shrink-0 ml-2">
              {tourStep + 1} / {TOUR_STEPS.length}
            </span>
          </div>
          <p className="text-sm text-[#aaa] leading-relaxed mb-4">
            {currentStep.description}
          </p>

          {/* Step dots */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === tourStep ? "bg-white" : i < tourStep ? "bg-white/50" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
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
