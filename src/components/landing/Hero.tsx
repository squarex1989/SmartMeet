import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Your second self at work.
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          Shadow observes your meetings, drafts your follow-ups, updates your CRM, and learns how you operate.
        </p>
        <Link
          href="/app"
          className="interactive-base mt-8 md:mt-10 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90"
        >
          Try Shadow
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          See it in action — no setup needed
        </p>
      </div>

      {/* Mobile: simple concept card */}
      <div className="mt-10 md:hidden max-w-sm mx-auto rounded-xl border border-border bg-surface-1 p-5 text-left">
        <p className="text-sm font-medium text-foreground mb-3">One place for every meeting</p>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>· Command Room — chat with Shadow</li>
          <li>· Work Panel — see what Shadow prepared</li>
          <li>· Calendar, Doc, Inbox — all in sync</li>
        </ul>
      </div>

      {/* Mock product UI — desktop only */}
      <div className="mt-16 max-w-5xl mx-auto rounded-xl border border-border bg-surface-1 overflow-hidden shadow-interactive-hover hidden md:block">
        {/* Top bar */}
        <div className="flex items-center h-10 px-4 border-b border-border bg-surface-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-4 text-xs text-muted-foreground">Shadow</span>
          <div className="ml-auto flex gap-3 text-[10px] text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-surface-3">Command Room</span>
            <span className="px-2 py-0.5 rounded bg-surface-3">Calendar</span>
            <span className="px-2 py-0.5 rounded bg-surface-3">Doc</span>
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">● TechVision</span>
          </div>
        </div>
        <div className="flex" style={{ height: 420 }}>
          {/* Left sidebar */}
          <div className="w-48 shrink-0 border-r border-border flex flex-col">
            <div className="p-3 text-[10px] uppercase tracking-wider text-muted-foreground">Topics</div>
            <div className="px-3 py-2 bg-accent/10 mx-2 rounded-md mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground">All Work</span>
              </div>
            </div>
            {[
              { name: "TechVision", color: "#E5684E" },
              { name: "RetailMax", color: "#3B8C6E" },
              { name: "CloudFlow", color: "#5B7BC0" },
            ].map((a) => (
              <div key={a.name} className="interactive-subtle px-3 py-2 mx-2 rounded-md flex items-center gap-2 hover:bg-surface-3 cursor-pointer">
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] shrink-0"
                  style={{ border: `1.5px solid ${a.color}`, color: a.color, backgroundColor: `${a.color}15` }}
                >
                  {a.name[0]}
                </span>
                <span className="text-xs text-foreground/80 truncate">{a.name}</span>
              </div>
            ))}
          </div>

          {/* Center: Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-hidden p-4 space-y-3">
              <div className="flex gap-2">
                <span className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[9px] text-accent shrink-0 mt-0.5">S</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground/80">Shadow</span>
                    <span className="text-[10px] text-muted-foreground">10:33</span>
                  </div>
                  <div className="mt-1 rounded-lg bg-surface-3 border border-border px-3 py-2 max-w-sm">
                    <p className="text-xs text-foreground/80">会议纪要已生成。识别到 4 个 follow-up 任务，CRM 更新方案已就绪。</p>
                    <div className="mt-2 rounded border border-accent/20 bg-accent/5 px-2 py-1.5 text-[10px] text-accent">
                      📄 TechVision 需求访谈纪要
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-lg bg-foreground px-3 py-2 max-w-xs">
                  <p className="text-xs text-background">确认更新 CRM</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[9px] text-accent shrink-0 mt-0.5">S</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground/80">Shadow</span>
                    <span className="text-[10px] text-muted-foreground">10:34</span>
                  </div>
                  <div className="mt-1 rounded-lg bg-surface-3 border border-border px-3 py-2 max-w-sm">
                    <p className="text-xs text-foreground/80">已更新。Slides 初稿正在生成中...</p>
                    <div className="mt-2 flex gap-2">
                      <span className="interactive-subtle px-2 py-1 rounded border border-border text-[10px] text-muted-foreground hover:text-foreground cursor-default">查看修改</span>
                      <span className="interactive-subtle px-2 py-1 rounded border border-border text-[10px] text-muted-foreground hover:text-foreground cursor-default">帮我生成 Slides</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[9px] text-accent shrink-0 mt-0.5">S</span>
                <div className="mt-1 rounded-lg bg-surface-3 border border-border px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border p-3">
              <div className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
                输入消息...
              </div>
            </div>
          </div>

          {/* Right: Work Panel */}
          <div className="w-56 shrink-0 border-l border-border flex flex-col">
            <div className="p-3 text-[10px] uppercase tracking-wider text-muted-foreground">Work Panel</div>
            <div className="flex-1 overflow-hidden p-2 space-y-2">
              {[
                { time: "10:32", text: "正在分析 transcript...", icon: "✓", iconColor: "var(--accent)" },
                { time: "10:33", text: "会议纪要已生成", icon: "✓", iconColor: "#10B981" },
                { time: "10:33", text: "CRM 更新已就绪", icon: "◷", iconColor: "#F59E0B" },
                { time: "10:34", text: "Slides 初稿生成中", icon: "↻", iconColor: "var(--muted-foreground)" },
                { time: "09:30", text: "工作坊 Agenda 已备好", icon: "✓", iconColor: "#10B981" },
                { time: "08:00", text: "CloudFlow 周报已生成", icon: "✓", iconColor: "#10B981" },
              ].map((log, i) => (
                <div key={i} className="interactive-subtle rounded border border-border bg-surface-2 p-2 cursor-default">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: log.iconColor }}>{log.icon}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{log.time}</span>
                  </div>
                  <p className="text-[10px] text-foreground/70 mt-1 leading-relaxed">{log.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
