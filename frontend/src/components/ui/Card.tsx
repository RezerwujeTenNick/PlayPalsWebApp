import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** rounded-xl (domyślne) | rounded-2xl | rounded-3xl */
  radius?: "xl" | "2xl" | "3xl";
  /** Podświetlenie obramowania przy hover/active */
  hoverable?: boolean;
}

const radii = { xl: "rounded-xl", "2xl": "rounded-2xl", "3xl": "rounded-3xl" } as const;

export default function Card({ children, radius = "xl", hoverable = false, className = "", ...props }: Props) {
  return (
    <div
      className={`glass-card ${radii[radius]} ${hoverable ? "hover:border-(--color-border-soft) transition-colors" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
