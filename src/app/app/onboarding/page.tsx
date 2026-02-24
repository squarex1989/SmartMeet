"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

const MOCK_MEETINGS = [
  { title: "TechVision", time: "Today, 10:00 AM" },
  { title: "RetailMax", time: "Yesterday, 2:30 PM" },
  { title: "CloudFlow", time: "Monday, 9:00 AM" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const [step, setStep] = useState(1);
  const [calendar, setCalendar] = useState(true);
  const [email, setEmail] = useState(false);
  const [crm, setCrm] = useState(false);

  const handleEnterShadow = () => {
    setOnboardingComplete(true);
    router.push("/app");
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background" data-theme="landing">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface-1 p-8 shadow-interactive-hover">
          <h1 className="text-xl font-semibold text-foreground">
            Let Shadow observe your work.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Shadow works best when it understands your meetings and emails.
          </p>
          <div className="mt-8 space-y-4">
            <label className="interactive-subtle flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 hover:border-accent/40">
              <input
                type="checkbox"
                checked={calendar}
                onChange={(e) => setCalendar(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-foreground">Connect Calendar</span>
              <span className="ml-auto text-xs text-muted-foreground">(recommended)</span>
            </label>
            <label className="interactive-subtle flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 hover:border-accent/40">
              <input
                type="checkbox"
                checked={email}
                onChange={(e) => setEmail(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-foreground">Connect Email</span>
            </label>
            <label className="interactive-subtle flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 hover:border-accent/40">
              <input
                type="checkbox"
                checked={crm}
                onChange={(e) => setCrm(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-foreground">Connect CRM</span>
            </label>
          </div>
          <Button
            onClick={() => setStep(2)}
            className="mt-8 w-full"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background" data-theme="landing">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface-1 p-8 shadow-interactive-hover">
        <h1 className="text-xl font-semibold text-foreground">
          Shadow found 3 recent meetings.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generating notes and follow-ups…
        </p>
        <div className="mt-8 space-y-4">
          {MOCK_MEETINGS.map((m) => (
            <div
              key={m.title}
              className="interactive-subtle flex items-center justify-between rounded-lg border border-border bg-background p-4"
            >
              <div>
                <p className="font-medium text-foreground">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.time}</p>
              </div>
              <span className="rounded-md border border-green-500/30 bg-green-500/20 px-2 py-1 text-xs text-green-500">
                Notes ready
              </span>
            </div>
          ))}
        </div>
        <Button
          onClick={handleEnterShadow}
          className="mt-8 w-full"
        >
          Enter Shadow
        </Button>
      </div>
    </div>
  );
}
