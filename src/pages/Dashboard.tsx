import { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

const Dashboard = () => {
  const { stats, tasks, initializeMockData } = useTaskStore();

  useEffect(() => { initializeMockData(); }, [initializeMockData]);

  const statCards = [
    { label: "Total Tasks", value: stats.total_tasks, icon: Clock, color: "bg-primary/10 text-primary" },
    { label: "Critical", value: stats.critical_tasks, icon: AlertTriangle, color: "bg-urgency-critical/10 text-urgency-critical" },
    { label: "Completed", value: stats.completed_tasks, icon: CheckCircle, color: "bg-urgency-low/10 text-urgency-low" },
    { label: "Active Volunteers", value: stats.active_volunteers, icon: Users, color: "bg-secondary/20 text-secondary-foreground" },
  ];

  const urgencyData = [
    { name: 'Critical', count: tasks.filter(t => t.urgency_level === 'CRITICAL').length, fill: 'hsl(0, 72%, 51%)' },
    { name: 'High', count: tasks.filter(t => t.urgency_level === 'HIGH').length, fill: 'hsl(25, 95%, 53%)' },
    { name: 'Medium', count: tasks.filter(t => t.urgency_level === 'MEDIUM').length, fill: 'hsl(43, 90%, 55%)' },
    { name: 'Low', count: tasks.filter(t => t.urgency_level === 'LOW').length, fill: 'hsl(152, 45%, 40%)' },
  ];

  const categoryData = tasks.reduce((acc, t) => {
    const existing = acc.find(a => a.name === t.category);
    if (existing) existing.count++;
    else acc.push({ name: t.category, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Overview of relief coordination status</p>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 shadow-[var(--card-shadow)]">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="font-heading text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
            <h3 className="font-heading text-lg font-semibold mb-4">Tasks by Urgency</h3>
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
            <h3 className="font-heading text-lg font-semibold mb-4">Tasks by Category</h3>
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

        {/* Verification Stats */}
        <div className="mt-6 rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
          <h3 className="font-heading text-lg font-semibold mb-4">Verification Status</h3>
          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.verified_tasks}</div>
              <div className="text-sm text-muted-foreground">Verified (NGO)</div>
              <div className="mt-2 h-2 w-32 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stats.total_tasks ? (stats.verified_tasks / stats.total_tasks) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-urgency-medium">{stats.unverified_tasks}</div>
              <div className="text-sm text-muted-foreground">Unverified (Public)</div>
              <div className="mt-2 h-2 w-32 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-urgency-medium rounded-full" style={{ width: `${stats.total_tasks ? (stats.unverified_tasks / stats.total_tasks) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
