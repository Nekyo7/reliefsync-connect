import { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Star, Briefcase } from "lucide-react";

const DEMO_VOLUNTEER = {
  id: "demo-volunteer",
  name: "Field Volunteer",
  location: "Whitefield",
  skills: ["Logistics", "Medical", "Community Outreach"],
  availability: "ON_CALL",
};

const Dashboard = () => {
  const stats = useTaskStore((state) => state.stats);
  const tasks = useTaskStore((state) => state.tasks);
  const matchVolunteer = useTaskStore((state) => state.matchVolunteer);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const loadCSVData = useTaskStore((state) => state.loadCSVData);

  useEffect(() => {
    void loadCSVData();

    const intervalId = window.setInterval(() => {
      void loadCSVData();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadCSVData]);

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
    if (existingCategory) {
      existingCategory.count += 1;
    } else {
      accumulator.push({ name: task.category, count: 1 });
    }
    return accumulator;
  }, [] as { name: string; count: number }[]);

  const recommendedTasks = matchVolunteer(DEMO_VOLUNTEER as any);
  const highPriorityTasks = tasks.filter((task) => task.status === 'OPEN' && (task.urgency_level === 'CRITICAL' || task.urgency_level === 'HIGH')).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Relief Command Center</h1>
        <p className="mb-8 text-muted-foreground">Live Google Sheets and n8n pipeline overview</p>

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

        <div className="mt-6 mb-8 rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 font-heading text-lg font-semibold">Verification Status</h3>
          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.verified_tasks}</div>
              <div className="text-sm text-muted-foreground">Verified (NGO)</div>
              <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${stats.total_tasks ? (stats.verified_tasks / stats.total_tasks) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-urgency-medium">{stats.unverified_tasks}</div>
              <div className="text-sm text-muted-foreground">Unverified (Public)</div>
              <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-urgency-medium" style={{ width: `${stats.total_tasks ? (stats.unverified_tasks / stats.total_tasks) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-[var(--card-shadow)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading text-lg font-semibold"><Star className="h-5 w-5 text-primary" /> Volunteer Matching</h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Top matched tasks for the current volunteer dataset</p>

            <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {recommendedTasks.length > 0 ? recommendedTasks.map((task) => (
                <div key={task.id} className="flex flex-col items-start gap-4 rounded-lg border bg-background p-4 transition-colors hover:border-primary/50">
                  <div className="w-full flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-heading font-semibold text-foreground">{task.title}</h4>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' ? 'bg-urgency-critical/10 text-urgency-critical' : task.urgency_level === 'HIGH' ? 'bg-urgency-high/10 text-urgency-high' : 'bg-primary/10 text-primary'}`}>
                        {task.priority_score.toFixed(1)} PRIORITY
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {task.location}
                    </div>
                    {task.required_skills.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {task.required_skills.slice(0, 3).map((skill, index) => (
                          <span key={`${skill}-${index}`} className="rounded-md bg-secondary/20 px-2 py-0.5 text-xs text-secondary-foreground">{skill}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => updateTaskStatus(task.id, 'ASSIGNED')}
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Accept Task
                  </button>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                  No matched tasks yet for the available volunteer rows.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-secondary/20 bg-card p-6 shadow-[var(--card-shadow)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading text-lg font-semibold"><Briefcase className="h-5 w-5 text-secondary-foreground" /> High Priority Queue</h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Tasks ready for assignment after n8n scoring</p>

            <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {highPriorityTasks.length > 0 ? highPriorityTasks.map((task) => (
                <div key={task.id} className="flex flex-col items-start gap-4 rounded-lg border bg-background p-4 transition-colors hover:border-secondary/50">
                  <div className="w-full flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-heading font-semibold text-foreground">{task.title}</h4>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' ? 'bg-urgency-critical/10 text-urgency-critical' : 'bg-urgency-high/10 text-urgency-high'}`}>
                        {task.urgency_level}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {task.location}
                    </div>
                  </div>
                  <div className="w-full rounded-md bg-muted p-2 text-xs text-muted-foreground">
                    Needs {task.required_skills.length ? task.required_skills.join(", ") : "general volunteers"}
                  </div>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                  No critical or high-priority tasks yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
