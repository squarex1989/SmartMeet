import { Calendar, MessageSquare, FileText } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Before",
    description: "会前自动准备 agenda、客户 research、推荐问题",
  },
  {
    icon: MessageSquare,
    title: "During",
    description: "会中实时转录、智能笔记、提问建议",
  },
  {
    icon: FileText,
    title: "After",
    description: "会后纪要、CRM 更新、任务识别、一键执行",
  },
];

export function Features() {
  return (
    <section id="product" className="py-24 px-6 border-t border-[#1E1E1E]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-[#EDEDED] text-center mb-16">
          Before, during, and after every meeting
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-[#1E1E1E] bg-[#111111] p-6"
            >
              <f.icon className="h-8 w-8 text-[#8A8A8A] mb-4" />
              <h3 className="text-lg font-semibold text-[#EDEDED]">{f.title}</h3>
              <p className="mt-2 text-sm text-[#8A8A8A]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
