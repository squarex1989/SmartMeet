const steps = [
  { title: "Create advisors for each client", detail: "为每个客户配置专属 Advisor" },
  { title: "Tell them how you work", detail: "在群聊中交代工作流程与偏好" },
  { title: "They handle the rest", detail: "会前准备、会中协助、会后跟进自动执行" },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6 border-t border-[#1E1E1E]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-[#EDEDED] text-center mb-16">
          How it works
        </h2>
        <div className="space-y-8">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1E1E1E] text-[#8A8A8A] font-medium">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#EDEDED]">{s.title}</h3>
                <p className="mt-1 text-sm text-[#8A8A8A]">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
