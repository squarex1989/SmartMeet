"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-4 md:px-6 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1E1E1E]">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#EDEDED]">
          Shadow
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            <a href="#product" className="text-sm text-[#8A8A8A] hover:text-[#EDEDED] transition">Product</a>
            <a href="#how" className="text-sm text-[#8A8A8A] hover:text-[#EDEDED] transition">How it works</a>
            <Link href="/app" className="text-sm text-[#8A8A8A] hover:text-[#EDEDED] transition">Log in</Link>
          </div>
          <Link
            href="/app/onboarding"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition shrink-0"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -mr-2 text-[#8A8A8A] hover:text-[#EDEDED]"
            aria-label="打开菜单"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
      {menuOpen && (
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-[#0A0A0A] border-l border-[#1E1E1E] flex flex-col pt-16 px-6 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#8A8A8A] hover:text-[#EDEDED]"
          aria-label="关闭菜单"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-6">
          <a href="#product" className="text-base text-[#EDEDED] hover:text-white" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="#how" className="text-base text-[#EDEDED] hover:text-white" onClick={() => setMenuOpen(false)}>How it works</a>
          <Link href="/app" className="text-base text-[#EDEDED] hover:text-white" onClick={() => setMenuOpen(false)}>Log in</Link>
        </div>
      </div>
      )}
    </>
  );
}
