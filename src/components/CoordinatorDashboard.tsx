import { Briefcase, MapPin } from "lucide-react";
import type { ReliefTask } from "@/types";

interface CoordinatorDashboardProps {
  stats: any;
  tasks: ReliefTask[];
}

export default function CoordinatorDashboard({ stats, tasks }: CoordinatorDashboardProps) {
  
  const highPriorityTasks = tasks.filter((task) => task.status === 'OPEN' && (task.urgency_level === 'CRITICAL' || task.urgency_level === 'HIGH')).slice(0, 10);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
        <h3 className="mb-4 font-heading text-xl font-semibold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-secondary-foreground" /> Global Coordination
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-2xl font-bold text-primary">{stats.verified_tasks}</div>
            <div className="text-sm text-muted-foreground">System Verified (NGO) Tasks</div>
            <div className="mt-2 h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${stats.total_tasks ? (stats.verified_tasks / stats.total_tasks) * 100 : 0}%` }} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-urgency-medium">{stats.unverified_tasks}</div>
            <div className="text-sm text-muted-foreground">Unverified (Public) Tasks</div>
            <div className="mt-2 h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-urgency-medium" style={{ width: `${stats.total_tasks ? (stats.unverified_tasks / stats.total_tasks) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-secondary/20 bg-card p-6 shadow-[var(--card-shadow)]">
        <div className="mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Critical Operations Action Queue</h3>
          <p className="text-sm text-muted-foreground">Highest priority unassigned tasks across all regions.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 space-y-4 md:space-y-0">
          {highPriorityTasks.length > 0 ? highPriorityTasks.map((task) => (
            <div key={task.id} className="flex flex-col items-start gap-4 rounded-lg border bg-background p-4 transition-colors hover:border-secondary/50 hover:shadow-md">
              <div className="w-full flex-1">
                <div className="flex items-start justify-between gap-2 overflow-hidden">
                  <h4 className="font-heading font-semibold text-foreground line-clamp-2">{task.title}</h4>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' ? 'bg-urgency-critical/10 text-urgency-critical' : 'bg-urgency-high/10 text-urgency-high'}`}>
                    {task.urgency_level}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {task.location}
                </div>
              </div>
              <div className="w-full rounded-md bg-muted p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Requirements:</span> {task.required_skills.length ? task.required_skills.join(", ") : "General Volunteers (No specific skills needed)"}
              </div>
            </div>
          )) : (
            <div className="col-span-full rounded-lg border border-dashed py-12 text-center text-muted-foreground">
              All critical and high priority tasks are currently assigned. Great job!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
