"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1E1E1E]">
      <Link href="/" className="text-lg font-semibold tracking-tight text-[#EDEDED]">
        SmartMeet
      </Link>
      <div className="flex items-center gap-6">
        <a href="#product" className="text-sm text-[#8A8A8A] hover:text-[#EDEDED] transition">Product</a>
        <a href="#how" className="text-sm text-[#8A8A8A] hover:text-[#EDEDED] transition">How it works</a>
        <Link href="/app" className="text-sm text-[#8A8A8A] hover:text-[#EDEDED] transition">Log in</Link>
        <Link
          href="/app/onboarding"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
