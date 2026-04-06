import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, CheckCircle, Clock, Users, MapPin } from "lucide-react";
import type { ReliefTask } from "@/types";

interface NGODashboardProps {
  stats: any;
  tasks: ReliefTask[];
  userEmail: string;
}

export default function NGODashboard({ stats, tasks, userEmail }: NGODashboardProps) {
  const myTasks = tasks.filter((task) => task.submitted_by === userEmail);

  const statCards = [
    { label: "Total Tasks", value: stats.total_tasks, icon: Clock, color: "bg-primary/10 text-primary" },
    { label: "Critical", value: stats.critical_tasks, icon: AlertTriangle, color: "bg-urgency-critical/10 text-urgency-critical" },
    { label: "Completed", value: stats.completed_tasks, icon: CheckCircle, color: "bg-urgency-low/10 text-urgency-low" },
    { label: "Active Volunteers", value: stats.active_volunteers, icon: Users, color: "bg-secondary/20 text-secondary-foreground" },
  ];

  const urgencyData = [
    { name: 'Critical', count: tasks.filter((task) => task.urgency_level === 'CRITICAL').length, fill: 'hsl(0, 72%, 51%)' },
    { name: 'High', count: tasks.filter((task) => task.urgency_level === 'HIGH').length, fill: 'hsl(25, 95%, 53%)' },
    { name: 'Medium', count: tasks.filter((task) => task.urgency_level === 'MEDIUM').length, fill: 'hsl(43, 90%, 55%)' },
    { name: 'Low', count: tasks.filter((task) => task.urgency_level === 'LOW').length, fill: 'hsl(152, 45%, 40%)' },
  ];

  const categoryData = tasks.reduce((accumulator, task) => {
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
            <div key={task.id} className="rounded-xl border bg-background p-4 shadow-sm">
              <h4 className="font-heading font-semibold text-foreground line-clamp-1">{task.title}</h4>
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {task.location}</span>
                <span className="flex items-center gap-2 mt-1">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' || task.urgency_level === 'HIGH' ? 'bg-red-100 text-red-700' : task.urgency_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    Priority: {task.urgency_level}
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    Verified: {task.verification_status === 'VERIFIED' ? "Yes" : "No"}
                  </span>
                </span>
                <span className="mt-2 text-xs font-semibold">
                  Status: {task.status !== 'OPEN' ? <span className="text-primary tracking-wide">Assigned</span> : "Unassigned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
