import Link from "next/link";

export function FooterCta() {
  return (
    <section className="py-24 px-6 border-t border-[#1E1E1E]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#EDEDED]">
          Ready to meet your advisors?
        </h2>
        <Link
          href="/app/onboarding"
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-black hover:opacity-90 transition"
        >
          Try the demo
        </Link>
      </div>
    </section>
  );
}
