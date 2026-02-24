import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="/" className="interactive-base hover:text-foreground">Shadow</Link>
          <a href="#product" className="interactive-base hover:text-foreground">Product</a>
          <span className="interactive-base hover:text-foreground cursor-pointer">Contact</span>
          <span className="interactive-base hover:text-foreground cursor-pointer">Twitter</span>
        </div>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
