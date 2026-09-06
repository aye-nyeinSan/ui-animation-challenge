export function SiteNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 bg-linear-to-b from-sea/90 to-transparent px-[clamp(16px,5vw,56px)] py-[clamp(10px,1.6vw,18px)]">
      <a
        className="flex items-baseline gap-1.5 whitespace-nowrap font-display text-cream no-underline [text-shadow:3px_3px_0_var(--color-ink)]"
        href="#top"
      >
        <span className="text-[clamp(13px,1.4vw,17px)] text-gold">The</span>
        <span className="text-[clamp(20px,2.4vw,30px)] tracking-[0.5px]">Krusty Krab</span>
      </a>
    </nav>
  );
}
