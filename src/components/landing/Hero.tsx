import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#EDEDED]">
          Your advisors, always prepared
        </h1>
        <p className="mt-6 text-lg text-[#8A8A8A] leading-relaxed">
          AI advisors that prepare, assist, and follow up on every client meeting — so you can focus on strategy, not admin.
        </p>
        <Link
          href="/app/onboarding"
          className="mt-10 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-black hover:opacity-90 transition"
        >
          Try the demo
        </Link>
      </div>
      <div className="mt-16 max-w-4xl mx-auto rounded-lg border border-[#1E1E1E] bg-[#111111] overflow-hidden shadow-2xl">
        <div className="aspect-video flex items-center justify-center text-[#8A8A8A] text-sm">
          Chat + Log 联动视图示意
        </div>
      </div>
    </section>
  );
}
