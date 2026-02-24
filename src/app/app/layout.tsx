"use client";

import { TopBar } from "@/components/layout/TopBar";
import { GuidedTour, TourHint } from "@/components/tour/GuidedTour";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      <GuidedTour />
      <TourHint />
    </div>
  );
}
