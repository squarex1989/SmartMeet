"use client";

import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-6 md:p-8 max-w-2xl overflow-auto">
      <Link
        href="/app"
        className="interactive-base mb-6 text-sm text-accent hover:underline"
      >
        ← Back
      </Link>
      <h1 className="text-xl font-semibold text-foreground mb-8">Settings</h1>
      <section className="mb-10">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Connected Tools
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-foreground">Calendar</span>
            <span className="text-xs text-green-500">connected</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-foreground">Email</span>
            <span className="text-xs text-muted-foreground">not connected</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-foreground">CRM</span>
            <span className="text-xs text-muted-foreground">not connected</span>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Account
        </h2>
        <div className="rounded-lg border border-border bg-background px-4 py-4 space-y-1">
          <p className="text-foreground">Sarah</p>
          <p className="text-sm text-muted-foreground">sarah@example.com</p>
        </div>
      </section>
    </div>
  );
}
