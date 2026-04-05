import { MapPin, Star } from "lucide-react";
import type { ReliefTask, Volunteer } from "@/types";
import { TaskMap } from "./TaskMap";

interface VolunteerDashboardProps {
  volunteer: any;
  matchedTasks: ReliefTask[];
  onAcceptTask: (taskId: string) => void;
}

export default function VolunteerDashboard({ 
  volunteer, 
  matchedTasks, 
  onAcceptTask 
}: VolunteerDashboardProps) {


  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-xl border border-primary/20 bg-card p-6 md:p-8 shadow-[var(--card-shadow)]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold"><Star className="h-6 w-6 text-primary" /> Volunteer Portal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Recommended OPEN tasks for {volunteer.name} (same location + overlapping skills, top 3 by priority).
          </p>
        </div>
        
        {/* STEP 5: REMOVE OLD VOLUNTEER SELECTOR */}
        {/* User dropdown has been removed here */}
      </div>

      <div className="mb-8 rounded-lg bg-secondary/10 p-5 border border-secondary/20">
        <h3 className="mb-3 font-heading font-semibold text-lg">Profile Summary</h3>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Name:</strong> {volunteer.name}</p>
          <p><strong className="text-foreground">Role:</strong> {volunteer.role}</p>
          <p><strong className="text-foreground">Location:</strong> {volunteer.location}</p>
          <p><strong className="text-foreground">Skills:</strong> {volunteer.skills?.join(", ") || "None listed"}</p>
        </div>
      </div>

      {recommendedTasks.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Matched Task Map</h3>
          <TaskMap tasks={recommendedTasks} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matchedTasks.length > 0 ? matchedTasks.map((task) => (
          <div key={task.id} className="flex flex-col items-start gap-4 rounded-lg border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-md">
            <div className="w-full flex-1">
              <div className="flex items-start justify-between gap-2 overflow-hidden">
                <h4 className="font-heading font-semibold text-foreground line-clamp-2">{task.title}</h4>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' ? 'bg-urgency-critical/10 text-urgency-critical' : task.urgency_level === 'HIGH' ? 'bg-urgency-high/10 text-urgency-high' : 'bg-primary/10 text-primary'}`}>
                  {Number.isFinite(task.priority_score) ? task.priority_score.toFixed(1) : "—"} priority
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" /> {task.location}
              </div>
              {task.required_skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.required_skills.slice(0, 3).map((skill, index) => (
                    <span key={`${skill}-${index}`} className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs text-secondary-foreground">{skill}</span>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              onClick={() => onAcceptTask(task.id)}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Accept Task
            </button>
          </div>
        )) : (
          <div className="col-span-full rounded-lg border border-dashed py-12 text-center text-muted-foreground">
            No OPEN tasks match your location and skills currently.
          </div>
        )}
      </div>
    </div>
  );
}
