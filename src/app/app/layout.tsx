"use client";

import { TopBar } from "@/components/layout/TopBar";
import { GuidedTour, TourHint } from "@/components/tour/GuidedTour";
import { DemoDock } from "@/components/DemoDock";
import { useAppStore } from "@/store/useAppStore";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoDocked = useAppStore((s) => s.demoDocked);

  return (
    <div className="flex h-screen flex-col bg-orange-50/50">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      {demoDocked && <DemoDock />}
      <GuidedTour />
      <TourHint />
    </div>
  );
}
