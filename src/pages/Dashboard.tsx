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
  
  // STEP 1: ROLE STATE
  const [role, setRole] = useState("volunteer");
  const [activeVolunteerId, setActiveVolunteerId] = useState<string | null>(null);

  useEffect(() => {
    initializeMockData();

    const intervalId = window.setInterval(() => {
      void loadCSVData();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [initializeMockData, loadCSVData]);

  // Derived logic for Volunteer Dashboard
  const selectedVolunteer = volunteers.find((volunteer) => volunteer.id === activeVolunteerId) ?? null;
  const recommendedTasks = selectedVolunteer ? matchVolunteer(selectedVolunteer) : [];

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
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="ngo">NGO Dashboard</option>
              <option value="volunteer">Volunteer Portal</option>
              <option value="coordinator">Coordinator Dashboard</option>
            </select>
          </div>
        </div>

        {/* STEP 4: ROLE-BASED RENDERING */}
        
        {role === "ngo" && (
          <NGODashboard stats={stats} tasks={tasks} userEmail="ngo@email.com" />
        )}

        {role === "volunteer" && (
          <VolunteerDashboard 
            volunteers={volunteers}
            activeVolunteerId={activeVolunteerId}
            setActiveVolunteerId={setActiveVolunteerId}
            recommendedTasks={recommendedTasks}
            onAcceptTask={(taskId) => updateTaskStatus(taskId, 'ASSIGNED')}
          />
        )}

        {role === "coordinator" && (
          <CoordinatorDashboard stats={stats} tasks={tasks} />
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;
