import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "success" | "urgency" | "neutral" | "outline-success";

const variantStyles: Record<BadgeVariant, string> = {
  gold: "bg-gold text-navy",
  success: "bg-success/10 text-success",
  urgency: "bg-urgency/10 text-urgency",
  neutral: "bg-bg text-navy/70",
  "outline-success": "bg-white text-success border border-success/30",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-badge px-2.5 py-1 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
