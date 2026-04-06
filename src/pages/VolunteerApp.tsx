import { useEffect, useMemo, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { TaskMap } from "@/components/TaskMap";
import type { ReliefTask } from "@/types";
import { ArrowRight, CheckCircle2, HeartHandshake, MapPin, Sparkles, Target, Trophy } from "lucide-react";

const VOLUNTEER_PROFILES = [
  {
    id: "volunteer-whitefield",
    name: "Aarav",
    email: "aarav@reliefsync.demo",
    location: "Whitefield",
    skills: ["Logistics", "First Aid", "Community Outreach"],
    availability: "ON_CALL",
  },
  {
    id: "volunteer-indiranagar",
    name: "Meera",
    email: "meera@reliefsync.demo",
    location: "Indiranagar",
    skills: ["Teaching", "Food Distribution", "Coordination"],
    availability: "PART_TIME",
  },
  {
    id: "volunteer-electronic-city",
    name: "Rahul",
    email: "rahul@reliefsync.demo",
    location: "Electronic City",
    skills: ["Transport", "Heavy Lifting", "Medical"],
    availability: "WEEKENDS",
  },
] as const;

const VolunteerApp = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const loadCSVData = useTaskStore((state) => state.loadCSVData);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null);

  useEffect(() => {
    void loadCSVData();

    const intervalId = window.setInterval(() => {
      void loadCSVData();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadCSVData]);

  useEffect(() => {
    if (!selectedVolunteerId) {
      setSelectedVolunteerId(VOLUNTEER_PROFILES[0].id);
    }
  }, [selectedVolunteerId]);

  const volunteer = useMemo(
    () => VOLUNTEER_PROFILES.find((item) => item.id === selectedVolunteerId) || VOLUNTEER_PROFILES[0],
    [selectedVolunteerId]
  );

  const volunteerSkills = useMemo(
    () => volunteer?.skills.map((skill) => skill.trim().toLowerCase()) || [],
    [volunteer]
  );

  const sameLocationTasks = useMemo(
    () =>
      volunteer
        ? tasks.filter(
            (task) => task.status === "OPEN" && task.location.trim().toLowerCase() === volunteer.location.trim().toLowerCase()
          )
        : [],
    [tasks, volunteer]
  );

  const matchedTasks = useMemo(() => {
    if (!volunteer) {
      return [];
    }

    return tasks
      .filter((task) => task.status === "OPEN")
      .map((task) => {
        const sameLocation = task.location.trim().toLowerCase() === volunteer.location.trim().toLowerCase();
        const skillMatches = task.required_skills.filter((skill) => volunteerSkills.includes(skill.trim().toLowerCase())).length;
        const score = task.priority_score + (sameLocation ? 25 : 0) + skillMatches * 12;
        return { task, score, sameLocation, skillMatches };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [tasks, volunteer, volunteerSkills]);

  const activeTask = useMemo(
    () => (volunteer ? tasks.find((task) => task.assigned_to === volunteer.id && task.status !== "COMPLETED") || null : null),
    [tasks, volunteer]
  );

  const completedTasks = useMemo(
    () => (volunteer ? tasks.filter((task) => task.assigned_to === volunteer.id && task.status === "COMPLETED") : []),
    [tasks, volunteer]
  );

  const impactPeople = useMemo(() => {
    const fromCompleted = completedTasks.reduce((sum, task) => {
      const match = task.description.match(/(\d+)\s*\+?\s*(families|people|households|children)/i);
      return sum + (match ? Number.parseInt(match[1], 10) : 0);
    }, 0);

    return fromCompleted || completedTasks.length * 24;
  }, [completedTasks]);

  const nearYouTasks = sameLocationTasks.slice(0, 4);
  const mapTasks = [...matchedTasks.map((item) => item.task), ...nearYouTasks].filter(
    (task, index, array) => array.findIndex((other) => other.id === task.id) === index
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.12),_transparent_30%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.35))]">
      <div className="container py-8">
        <section className="overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-[var(--card-shadow)] md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                {matchedTasks.length} urgent tasks selected for you
              </div>
              <div>
                <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Missions near {volunteer.location}
                </h1>
                <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                  Your volunteer app focuses on what you can do right now: the best-fit tasks, nearby needs, and the mission you are currently carrying.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border bg-background/70 p-4">
                  <div className="text-sm text-muted-foreground">Tasks completed</div>
                  <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-foreground">
                    <Trophy className="h-6 w-6 text-primary" />
                    {completedTasks.length}
                  </div>
                </div>
                <div className="rounded-2xl border bg-background/70 p-4">
                  <div className="text-sm text-muted-foreground">People helped</div>
                  <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-foreground">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                    {impactPeople}
                  </div>
                </div>
                <div className="rounded-2xl border bg-background/70 p-4">
                  <div className="text-sm text-muted-foreground">Availability</div>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
                    <Target className="h-5 w-5 text-primary" />
                    {volunteer.availability.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border bg-background/75 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Volunteer profile</div>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">{volunteer.name}</h2>
                </div>
                <select
                  className="rounded-lg border bg-card px-3 py-2 text-sm"
                  value={volunteer.id}
                  onChange={(event) => setSelectedVolunteerId(event.target.value)}
                >
                  {VOLUNTEER_PROFILES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {volunteer.location}
                </div>
                <div>{volunteer.email}</div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {volunteer.skills.length > 0 ? (
                    volunteer.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs">No skills added yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border bg-card p-6 shadow-[var(--card-shadow)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">For You</h2>
                <p className="text-sm text-muted-foreground">Top 3 missions based on priority, location, and skill match.</p>
              </div>
            </div>

            <div className="grid gap-4">
              {matchedTasks.length > 0 ? matchedTasks.map(({ task, sameLocation, skillMatches }) => (
                <div key={task.id} className="rounded-2xl border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {task.urgency_level} priority
                      </div>
                      <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">{task.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{task.description || "No description provided yet."}</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/15 px-4 py-3 text-right">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Match</div>
                      <div className="mt-1 text-2xl font-bold text-foreground">{task.priority_score.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {sameLocation ? "In your area" : task.location}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {skillMatches} skill {skillMatches === 1 ? "match" : "matches"}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {task.source_type}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {task.required_skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="rounded-full border px-3 py-1 text-xs font-medium text-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => updateTaskStatus(task.id, "ASSIGNED", volunteer.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Accept Task
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                  No matched missions yet. Add more volunteer rows or adjust locations in the sheet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border bg-card p-6 shadow-[var(--card-shadow)]">
              <h2 className="font-heading text-2xl font-semibold text-foreground">Active Task</h2>
              <p className="mt-1 text-sm text-muted-foreground">The mission you are currently carrying.</p>

              {activeTask ? (
                <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                  <div className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    In progress
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">{activeTask.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{activeTask.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div>Location: {activeTask.location}</div>
                    <div>Category: {activeTask.category}</div>
                    <div>Needs: {activeTask.required_skills.length ? activeTask.required_skills.join(", ") : "General support"}</div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => updateTaskStatus(activeTask.id, "IN_PROGRESS", volunteer.id)}
                      className="rounded-full border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => updateTaskStatus(activeTask.id, "COMPLETED", volunteer.id)}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                  Accept one mission to start tracking your active task here.
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border bg-card p-6 shadow-[var(--card-shadow)]">
              <h2 className="font-heading text-2xl font-semibold text-foreground">Completed Tasks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your recent wins and the impact they created.</p>

              <div className="mt-5 space-y-3">
                {completedTasks.length > 0 ? completedTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{task.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {task.location} • {new Date(task.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                    Your completed missions will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border bg-card p-6 shadow-[var(--card-shadow)]">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Near You</h2>
            <p className="mt-1 text-sm text-muted-foreground">Open tasks in the same location, ready when you are.</p>

            <div className="mt-5 space-y-3">
              {nearYouTasks.length > 0 ? nearYouTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-foreground">{task.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{task.category}</div>
                    </div>
                    <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {task.urgency_level}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{task.location}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, "ASSIGNED", volunteer.id)}
                      className="font-medium text-primary hover:underline"
                    >
                      Take mission
                    </button>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                  No nearby tasks in the same location right now.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border bg-card p-6 shadow-[var(--card-shadow)]">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Mission Map</h2>
            <p className="mt-1 text-sm text-muted-foreground">Visualize your recommended and nearby tasks.</p>
            <div className="mt-5">
              <TaskMap tasks={mapTasks.length > 0 ? mapTasks : tasks.slice(0, 5)} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VolunteerApp;
