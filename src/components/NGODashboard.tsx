import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Calendar, Activity } from "lucide-react";
import type { ReliefTask } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface NGODashboardProps {
  stats: any;
  tasks: ReliefTask[];
  userEmail: string;
}

export default function NGODashboard({ stats, tasks, userEmail }: NGODashboardProps) {
  const [selectedTask, setSelectedTask] = useState<ReliefTask | null>(null);

  // Filter ONLY to the NGO's tasks and sort newest first
  const myTasks = tasks
    .filter((task) => task.submitted_by === userEmail)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Derive stats exclusively from myTasks
  const myStats = {
    total_tasks: myTasks.length,
    critical_tasks: myTasks.filter(t => t.urgency_level === 'CRITICAL').length,
    completed_tasks: myTasks.filter(t => t.status === 'COMPLETED').length,
    active_volunteers: stats.active_volunteers // Global value for reference
  };

  const statCards = [
    { label: "My Total Needs", value: myStats.total_tasks, icon: Clock, color: "bg-primary/10 text-primary" },
    { label: "My Critical Priorities", value: myStats.critical_tasks, icon: AlertTriangle, color: "bg-urgency-critical/10 text-urgency-critical" },
    { label: "My Completed Needs", value: myStats.completed_tasks, icon: CheckCircle, color: "bg-urgency-low/10 text-urgency-low" },
    { label: "Network Volunteers", value: myStats.active_volunteers, icon: Users, color: "bg-secondary/20 text-secondary-foreground" },
  ];

  const urgencyData = [
    { name: 'Critical', count: myTasks.filter((task) => task.urgency_level === 'CRITICAL').length, fill: 'hsl(0, 72%, 51%)' },
    { name: 'High', count: myTasks.filter((task) => task.urgency_level === 'HIGH').length, fill: 'hsl(25, 95%, 53%)' },
    { name: 'Medium', count: myTasks.filter((task) => task.urgency_level === 'MEDIUM').length, fill: 'hsl(43, 90%, 55%)' },
    { name: 'Low', count: myTasks.filter((task) => task.urgency_level === 'LOW').length, fill: 'hsl(152, 45%, 40%)' },
  ];

  const categoryData = myTasks.reduce((accumulator, task) => {
    const existingCategory = accumulator.find((item) => item.name === task.category);
    if (existingCategory) existingCategory.count += 1;
    else accumulator.push({ name: task.category, count: 1 });
    return accumulator;
  }, [] as { name: string; count: number }[]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="mb-6 font-heading text-xl font-semibold">NGO Overview</h2>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((statCard, index) => (
          <div key={index} className="rounded-xl border bg-card p-5 shadow-[var(--card-shadow)]">
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${statCard.color}`}>
                <statCard.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="font-heading text-2xl font-bold text-foreground">{statCard.value}</div>
            <div className="text-sm text-muted-foreground">{statCard.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 font-heading text-lg font-semibold">Tasks by Urgency</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={urgencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {urgencyData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 font-heading text-lg font-semibold">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="name" label={({ name }) => name}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={['hsl(152, 45%, 22%)', 'hsl(43, 90%, 55%)', 'hsl(25, 95%, 53%)', 'hsl(0, 72%, 51%)', 'hsl(200, 60%, 50%)', 'hsl(280, 50%, 50%)', 'hsl(152, 45%, 40%)', 'hsl(43, 70%, 45%)'][index % 8]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
        <h3 className="mb-4 font-heading text-lg font-semibold">My Submitted Tasks</h3>
        {myTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">No tasks submitted yet</p>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myTasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => setSelectedTask(task)}
              className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:border-primary/50 transition-colors hover:shadow-md"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-heading font-semibold text-foreground line-clamp-1">{task.title}</h4>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>
                  {task.urgency_level}
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {task.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(task.timestamp).toLocaleDateString()}</span>
                <span className="mt-2 text-xs font-semibold flex items-center justify-between">
                  <span>Status: {task.status !== 'OPEN' ? <span className="text-primary tracking-wide">Assigned</span> : "Unassigned"}</span>
                  <span className="text-[10px] underline underline-offset-2">View details</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              Posted on {selectedTask && new Date(selectedTask.timestamp).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${selectedTask.urgency_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>
                  {selectedTask.urgency_level} PRIORITY
                </span>
                <span className="rounded-full px-2 py-1 text-xs font-bold bg-secondary/20 text-secondary-foreground">
                  STATUS: {selectedTask.status}
                </span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-1 text-sm border-t pt-4">
                <span className="col-span-4 font-semibold text-foreground flex items-center gap-1 mb-1">
                  <MapPin className="h-4 w-4" /> Location
                </span>
                <span className="col-span-4 text-muted-foreground mb-3">{selectedTask.location}</span>
                
                <span className="col-span-4 font-semibold text-foreground flex items-center gap-1 mb-1">
                  <Activity className="h-4 w-4" /> Description
                </span>
                <span className="col-span-4 text-muted-foreground mb-3">{selectedTask.description || "No detailed description provided."}</span>
                
                <span className="col-span-4 font-semibold text-foreground flex items-center gap-1 mb-1">
                  <Users className="h-4 w-4" /> Required Skills & Volunteers
                </span>
                <span className="col-span-4 text-muted-foreground">
                  Minimum {(selectedTask as any).people || "1"} volunteer(s) needed.<br/>
                  Skills: {selectedTask.required_skills.length ? selectedTask.required_skills.join(", ") : "General volunteering"}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
