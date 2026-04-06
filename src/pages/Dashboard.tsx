import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import NGODashboard from "@/components/NGODashboard";
import VolunteerDashboard from "@/components/VolunteerDashboard";
import CoordinatorDashboard from "@/components/CoordinatorDashboard";
import { useAuthStore } from "@/store/useAuthStore";

const Dashboard = () => {
  const stats = useTaskStore((state) => state.stats);
  const tasks = useTaskStore((state) => state.tasks);
  const volunteers = useTaskStore((state) => state.volunteers);
  const isLoading = useTaskStore((state) => state.isLoading);
  const matchVolunteer = useTaskStore((state) => state.matchVolunteer);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const initializeMockData = useTaskStore((state) => state.initializeMockData);
  const loadCSVData = useTaskStore((state) => state.loadCSVData);
  
  const { user: authUser, role, setRole } = useAuthStore();
  
  // STEP 1: CREATE USER STATE (TOP LEVEL)
  const user = {
    id: authUser?.id || "guest-1",
    name: authUser?.user_metadata?.full_name || "Guest",
    role: role || "volunteer",
    location: authUser?.user_metadata?.location || "Whitefield",
    skills: authUser?.user_metadata?.skills || ["General Help", "Logistics"],
    email: authUser?.email || "guest@email.com"
  };

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
          
          {/* Role is strictly enforced by authentication state */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold shadow-sm bg-primary/10 text-primary uppercase tracking-wider">
              {role} portal
            </div>
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
