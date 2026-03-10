import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type Size    = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)";

const variants: Record<Variant, string> = {
  // Neonowy akcent — główna akcja
  primary:
    "bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-bg) neon-glow",
  // Drugoplanowa — wypełniona tłem
  secondary:
    "bg-(--color-bg-elevated) hover:bg-(--color-bg-secondary) text-(--color-text-secondary) border border-(--color-border-soft)",
  // Obramowanie w kolorze primary
  outline:
    "border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary-glow)",
  // Bez tła — subtelna
  ghost:
    "text-(--color-text-secondary) hover:bg-white/5 hover:text-(--color-text-primary)",
  // Kwadratowa ikona
  icon:
    "text-(--color-text-muted) hover:bg-white/5 hover:text-(--color-text-primary) rounded-xl",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

const iconSizes: Record<Size, string> = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...props }: Props) {
  const sizeClass = variant === "icon" ? iconSizes[size] : sizes[size];
  return (
    <button
      className={`${base} ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
