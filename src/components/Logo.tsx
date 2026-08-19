import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-hero shadow-glow">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h3l2-6 4 12 2-6h5" />
        </svg>
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        Brynier
      </span>
    </Link>
  );
}
