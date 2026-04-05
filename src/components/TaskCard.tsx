import type { ReliefTask } from "@/types";
import { UrgencyBadge } from "./UrgencyBadge";
import { VerificationTag } from "./VerificationTag";
import { MapPin, Clock, Tag } from "lucide-react";
import { Button } from "./ui/button";

interface TaskCardProps {
  task: ReliefTask;
  onViewDetails?: (task: ReliefTask) => void;
}

export const TaskCard = ({ task, onViewDetails }: TaskCardProps) => {
  const statusColors: Record<string, string> = {
    OPEN: 'bg-primary/10 text-primary',
    ASSIGNED: 'bg-secondary/20 text-secondary-foreground',
    IN_PROGRESS: 'bg-urgency-medium/15 text-urgency-medium',
    COMPLETED: 'bg-urgency-low/15 text-urgency-low',
  };

  return (
    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] shadow-[var(--card-shadow)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <UrgencyBadge level={task.urgency_level} />
          <VerificationTag status={task.verification_status} />
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">{task.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{new Date(task.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {task.required_skills.map((skill) => (
          <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            <Tag className="h-2.5 w-2.5" />{skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{task.priority_score}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onViewDetails?.(task)}>
          View Details
        </Button>
      </div>
    </div>
  );
};
