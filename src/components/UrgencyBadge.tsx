import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/types";

const urgencyBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      urgency: {
        CRITICAL: "bg-urgency-critical/15 text-urgency-critical border border-urgency-critical/30",
        HIGH: "bg-urgency-high/15 text-urgency-high border border-urgency-high/30",
        MEDIUM: "bg-urgency-medium/15 text-urgency-medium border border-urgency-medium/30",
        LOW: "bg-urgency-low/15 text-urgency-low border border-urgency-low/30",
      },
    },
  }
);

interface UrgencyBadgeProps extends VariantProps<typeof urgencyBadgeVariants> {
  level: UrgencyLevel;
  className?: string;
}

export const UrgencyBadge = ({ level, className }: UrgencyBadgeProps) => (
  <span className={cn(urgencyBadgeVariants({ urgency: level }), className)}>
    {level === 'CRITICAL' && '🔴 '}{level}
  </span>
);
