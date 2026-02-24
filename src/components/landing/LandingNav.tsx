"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border">
        <Link href="/" className="interactive-base text-lg font-semibold tracking-tight text-foreground">
          Shadow
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            <a href="#product" className="interactive-base text-sm text-muted-foreground hover:text-foreground">Product</a>
            <a href="#how" className="interactive-base text-sm text-muted-foreground hover:text-foreground">How it works</a>
            <Link href="/app" className="interactive-base text-sm text-muted-foreground hover:text-foreground">Log in</Link>
          </div>
          <Link
            href="/app/onboarding"
            className="interactive-base rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 shrink-0"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="interactive-base md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
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
        <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-background border-l border-border flex flex-col pt-16 px-6 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="interactive-base absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col gap-6">
            <a href="#product" className="interactive-base text-base text-foreground hover:text-accent" onClick={() => setMenuOpen(false)}>Product</a>
            <a href="#how" className="interactive-base text-base text-foreground hover:text-accent" onClick={() => setMenuOpen(false)}>How it works</a>
            <Link href="/app" className="interactive-base text-base text-foreground hover:text-accent" onClick={() => setMenuOpen(false)}>Log in</Link>
          </div>
        </div>
      )}
    </>
  );
}
