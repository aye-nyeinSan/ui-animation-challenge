import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[clamp(11px,1.1vw,13px)] font-extrabold uppercase tracking-[0.26em] text-gold">
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="m-0 font-display text-[clamp(38px,min(6vw,9vh),88px)] font-normal leading-[0.94] [text-shadow:5px_5px_0_var(--color-ink)]">
      {children}
    </h2>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mt-3.5 max-w-[48ch] text-[clamp(15px,1.3vw,19px)] font-bold leading-normal text-pretty">
      {children}
    </p>
  );
}
