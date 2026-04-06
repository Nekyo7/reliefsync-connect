import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import NGODashboard from "@/components/NGODashboard";
import VolunteerDashboard from "@/components/VolunteerDashboard";
import CoordinatorDashboard from "@/components/CoordinatorDashboard";

const Dashboard = () => {
  const stats = useTaskStore((state) => state.stats);
  const tasks = useTaskStore((state) => state.tasks);
  const volunteers = useTaskStore((state) => state.volunteers);
  const isLoading = useTaskStore((state) => state.isLoading);
  const matchVolunteer = useTaskStore((state) => state.matchVolunteer);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const initializeMockData = useTaskStore((state) => state.initializeMockData);
  const loadCSVData = useTaskStore((state) => state.loadCSVData);
  
  // STEP 1: CREATE USER STATE (TOP LEVEL)
  const [user, setUser] = useState({
    name: "Anish",
    role: "volunteer", // "ngo" | "volunteer" | "coordinator"
    location: "Whitefield",
    skills: ["General Help", "Logistics"],
    email: "anish@email.com"
  });

  // STEP 2: REPLACE ROLE STATE (IMPORTANT)
  const role = user.role;

  useEffect(() => {
    initializeMockData();

    const intervalId = window.setInterval(() => {
      void loadCSVData();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [initializeMockData, loadCSVData]);


  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Relief Command Center</h1>
            <p className="text-muted-foreground">
              Live Google Sheets integration
              {isLoading ? <span className="ml-2 text-xs text-primary animate-pulse">(syncing data…)</span> : null}
            </p>
          </div>
          
          {/* STEP 2: ROLE SELECTOR */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Active Role View:</label>
            <select
              className="min-w-[200px] rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium"
              value={user.role}
              onChange={(e) =>
                setUser({ ...user, role: e.target.value })
              }
            >
              <option value="ngo">NGO Dashboard</option>
              <option value="volunteer">Volunteer Portal</option>
              <option value="coordinator">Coordinator Dashboard</option>
            </select>
          </div>
        </div>

        {/* STEP 4: ROLE-BASED RENDERING */}
        
        {role === "ngo" && (
          <NGODashboard stats={stats} tasks={tasks} userEmail={user.email} />
        )}

        {role === "volunteer" && (
          <VolunteerDashboard 
            volunteer={user} // 🔥 use real user instead of selectedVolunteer
            matchedTasks={matchVolunteer(user as any)}
            onAcceptTask={(taskId) => updateTaskStatus(taskId, 'ASSIGNED')}
          />
        )}

        {role === "coordinator" && (
          <CoordinatorDashboard stats={stats} tasks={tasks} />
        )}

        {/* STEP 6: SIMPLE PROFILE DISPLAY */}
        <div style={{ marginBottom: "20px", marginTop: "20px", padding: "20px", border: "1px solid var(--border)", borderRadius: "8px", backgroundColor: "var(--card)" }}>
          <h3 className="font-heading font-semibold text-lg mb-2">Current User</h3>
          <p className="text-sm text-muted-foreground"><strong>Name:</strong> {user.name}</p>
          <p className="text-sm text-muted-foreground"><strong>Role:</strong> {user.role}</p>
          <p className="text-sm text-muted-foreground"><strong>Location:</strong> {user.location}</p>
          <p className="text-sm text-muted-foreground"><strong>Skills:</strong> {user.skills.join(", ")}</p>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
