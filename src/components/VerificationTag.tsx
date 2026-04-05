import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";
import { CheckCircle, AlertCircle } from "lucide-react";

interface VerificationTagProps {
  status: VerificationStatus;
  className?: string;
}

export const VerificationTag = ({ status, className }: VerificationTagProps) => (
  <span className={cn(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
    status === 'VERIFIED'
      ? "bg-primary/10 text-primary"
      : "bg-muted text-muted-foreground",
    className
  )}>
    {status === 'VERIFIED' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
    {status === 'VERIFIED' ? 'Verified' : 'Unverified'}
  </span>
);
