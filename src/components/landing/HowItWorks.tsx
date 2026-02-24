const steps = [
  { title: "Connect your tools", detail: "连接 Calendar、Email、CRM" },
  { title: "Shadow observes", detail: "Shadow 自动观察你的会议和工作" },
  { title: "Shadow prepares drafts", detail: "生成纪要、报告、邮件草稿" },
  { title: "You review and approve", detail: "你审核、修改、确认执行" },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 px-4 md:px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-10 md:mb-16">
          How it works
        </h2>
        <div className="space-y-6 md:space-y-8">
          {steps.map((s, i) => (
            <div key={i} className="interactive-subtle flex gap-4 md:gap-6 group">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground font-medium group-hover:border-accent/50 group-hover:text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
