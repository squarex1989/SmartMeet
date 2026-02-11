import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#EDEDED]">
          Your shadow, always prepared
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-lg text-[#8A8A8A] leading-relaxed">
          Shadow follows every meeting — your AI advisors prepare, assist, and follow up so you can focus on strategy, not admin.
        </p>
        <Link
          href="/app/onboarding"
          className="mt-8 md:mt-10 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-black hover:opacity-90 transition"
        >
          Try the demo
        </Link>
      </div>

      {/* Mobile: simple concept card */}
      <div className="mt-10 md:hidden max-w-sm mx-auto rounded-xl border border-[#1E1E1E] bg-[#111111] p-5 text-left">
        <p className="text-sm font-medium text-[#EDEDED] mb-3">One place for every meeting</p>
        <ul className="text-xs text-[#8A8A8A] space-y-2">
          <li>· Command Room — chat with AI advisors</li>
          <li>· Activity Log — see what they did</li>
          <li>· Calendar, Doc, Inbox — all in sync</li>
        </ul>
      </div>

      {/* Mock product UI — desktop only */}
      <div className="mt-16 max-w-5xl mx-auto rounded-xl border border-[#1E1E1E] bg-[#0D0D0D] overflow-hidden shadow-2xl hidden md:block">
        {/* Top bar */}
        <div className="flex items-center h-10 px-4 border-b border-[#1E1E1E] bg-[#111111]">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="ml-4 text-xs text-[#555]">Shadow</span>
          <div className="ml-auto flex gap-3 text-[10px] text-[#444]">
            <span className="px-2 py-0.5 rounded bg-white/5">Command Room</span>
            <span className="px-2 py-0.5 rounded bg-white/5">Calendar</span>
            <span className="px-2 py-0.5 rounded bg-white/5">Doc</span>
            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 border border-green-500/30">● TechVision</span>
          </div>
        </div>
        <div className="flex" style={{ height: 420 }}>
          {/* Left sidebar */}
          <div className="w-48 shrink-0 border-r border-[#1E1E1E] flex flex-col">
            <div className="p-3 text-[10px] uppercase tracking-wider text-[#555]">对话</div>
            <div className="px-3 py-2 bg-white/5 mx-2 rounded-md mb-1">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <span className="h-5 w-5 rounded-full bg-[#E5684E]/20 border border-[#E5684E] flex items-center justify-center text-[8px] text-[#E5684E]">A</span>
                  <span className="h-5 w-5 rounded-full bg-[#3B8C6E]/20 border border-[#3B8C6E] flex items-center justify-center text-[8px] text-[#3B8C6E]">J</span>
                  <span className="h-5 w-5 rounded-full bg-[#5B7BC0]/20 border border-[#5B7BC0] flex items-center justify-center text-[8px] text-[#5B7BC0]">M</span>
                </div>
                <span className="text-xs text-[#ccc]">All Advisors</span>
              </div>
            </div>
            {[
              { name: "Alex", color: "#E5684E", desc: "TechVision" },
              { name: "Jamie", color: "#3B8C6E", desc: "RetailMax" },
              { name: "Morgan", color: "#5B7BC0", desc: "CloudFlow" },
            ].map((a) => (
              <div key={a.name} className="px-3 py-2 mx-2 rounded-md flex items-center gap-2 hover:bg-white/5 transition">
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] shrink-0"
                  style={{ border: `1.5px solid ${a.color}`, color: a.color, backgroundColor: `${a.color}15` }}
                >
                  {a.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-[#ccc] truncate">{a.name}</p>
                  <p className="text-[10px] text-[#555] truncate">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Center: Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-hidden p-4 space-y-3">
              {/* Advisor message */}
              <div className="flex gap-2">
                <span className="h-6 w-6 rounded-full bg-[#E5684E]/20 border border-[#E5684E] flex items-center justify-center text-[9px] text-[#E5684E] shrink-0 mt-0.5">A</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#ccc]">Alex</span>
                    <span className="text-[10px] text-[#555]">10:33</span>
                  </div>
                  <div className="mt-1 rounded-lg bg-[#1A1A1A] border border-[#222] px-3 py-2 max-w-sm">
                    <p className="text-xs text-[#aaa]">会议纪要已生成。识别到 4 个 follow-up 任务，CRM 更新方案已就绪。</p>
                    <div className="mt-2 rounded border border-[#2A2A2A] bg-[#141414] px-2 py-1.5 text-[10px] text-[#6B8AFF]">
                      📄 TechVision 需求访谈纪要
                    </div>
                  </div>
                </div>
              </div>
              {/* User message */}
              <div className="flex justify-end">
                <div className="rounded-lg bg-[#EDEDED] px-3 py-2 max-w-xs">
                  <p className="text-xs text-[#111]">确认更新 CRM</p>
                </div>
              </div>
              {/* Advisor reply */}
              <div className="flex gap-2">
                <span className="h-6 w-6 rounded-full bg-[#E5684E]/20 border border-[#E5684E] flex items-center justify-center text-[9px] text-[#E5684E] shrink-0 mt-0.5">A</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#ccc]">Alex</span>
                    <span className="text-[10px] text-[#555]">10:34</span>
                  </div>
                  <div className="mt-1 rounded-lg bg-[#1A1A1A] border border-[#222] px-3 py-2 max-w-sm">
                    <p className="text-xs text-[#aaa]">已更新。Slides 初稿正在生成中...</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 rounded border border-[#333] text-[10px] text-[#888] hover:bg-white/5 cursor-default">查看修改</span>
                      <span className="px-2 py-1 rounded border border-[#333] text-[10px] text-[#888] hover:bg-white/5 cursor-default">帮我生成 Slides</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Loading */}
              <div className="flex gap-2">
                <span className="h-6 w-6 rounded-full bg-[#E5684E]/20 border border-[#E5684E] flex items-center justify-center text-[9px] text-[#E5684E] shrink-0 mt-0.5">A</span>
                <div className="mt-1 rounded-lg bg-[#1A1A1A] border border-[#222] px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#555] animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#555] animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#555] animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Input */}
            <div className="border-t border-[#1E1E1E] p-3">
              <div className="rounded-md border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#444]">
                输入消息...
              </div>
            </div>
          </div>

          {/* Right: Activity Log */}
          <div className="w-56 shrink-0 border-l border-[#1E1E1E] flex flex-col">
            <div className="p-3 text-[10px] uppercase tracking-wider text-[#555]">Activity Log</div>
            <div className="flex-1 overflow-hidden p-2 space-y-2">
              {[
                { time: "10:32", name: "Alex", color: "#E5684E", text: "正在分析 transcript...", icon: "✓", iconColor: "#28C840" },
                { time: "10:33", name: "Alex", color: "#E5684E", text: "会议纪要已生成", icon: "✓", iconColor: "#28C840" },
                { time: "10:33", name: "Alex", color: "#E5684E", text: "CRM 更新已就绪", icon: "◷", iconColor: "#FEBC2E" },
                { time: "10:34", name: "Alex", color: "#E5684E", text: "Slides 初稿生成中", icon: "↻", iconColor: "#888" },
                { time: "09:30", name: "Jamie", color: "#3B8C6E", text: "工作坊 Agenda 已备好", icon: "✓", iconColor: "#28C840" },
                { time: "08:00", name: "Morgan", color: "#5B7BC0", text: "CloudFlow 周报已生成", icon: "✓", iconColor: "#28C840" },
              ].map((log, i) => (
                <div key={i} className="rounded border border-[#1E1E1E] bg-[#111111] p-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-4 w-4 rounded-full flex items-center justify-center text-[7px] shrink-0"
                      style={{ border: `1.5px solid ${log.color}`, color: log.color }}
                    >
                      {log.name[0]}
                    </span>
                    <span className="text-[10px] text-[#888]">{log.name}</span>
                    <span className="text-[10px] text-[#444] ml-auto">{log.time}</span>
                    <span className="text-[10px]" style={{ color: log.iconColor }}>{log.icon}</span>
                  </div>
                  <p className="text-[10px] text-[#777] mt-1 leading-relaxed">{log.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
