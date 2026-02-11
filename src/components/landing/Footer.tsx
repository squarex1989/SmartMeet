import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 border-t border-[#1E1E1E]">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 md:flex-row md:items-center md:justify-between text-sm text-[#8A8A8A]">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="/" className="hover:text-[#EDEDED] transition">Shadow</Link>
          <a href="#product" className="hover:text-[#EDEDED] transition">Product</a>
          <span>Contact</span>
          <span>Twitter</span>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
