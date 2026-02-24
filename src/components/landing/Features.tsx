import { Zap, Clock, Network } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Auto-execute",
    description: "会后自动生成纪要、更新 CRM、发送 follow-up",
  },
  {
    icon: Clock,
    title: "Scheduled reports",
    description: "定期生成周报、汇总，按时交付",
  },
  {
    icon: Network,
    title: "Structured workspace",
    description: "按客户、项目、目标组织工作，图结构关联",
  },
];

export function Features() {
  return (
    <section id="product" className="py-24 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-16">
          Smart automation that works for you
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="interactive-subtle rounded-lg border border-border bg-surface-1 p-6 hover:border-accent/30"
            >
              <f.icon className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
