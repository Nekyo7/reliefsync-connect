import { create } from 'zustand';
import type { ReliefTask, DashboardStats, Volunteer } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockTasks } from '@/data/mockData';

const normalizeList = (value: any) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const normalizeStatus = (value?: string): ReliefTask['status'] => {
  const normalized = value?.trim().toUpperCase().replace(/\s+/g, "_");
  if (normalized === 'ASSIGNED' || normalized === 'IN_PROGRESS' || normalized === 'COMPLETED') return normalized;
  return 'OPEN';
};

const normalizeUrgency = (value?: string): ReliefTask['urgency_level'] | null => {
  const normalized = value?.trim().toUpperCase();
  if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH' || normalized === 'CRITICAL') return normalized;
  return null;
};

// Format logic for Tasks
const formatTasks = (rows: any[]): ReliefTask[] => {
  if (!rows?.length) return [];

  const formatted = rows.map((obj, i) => {
    return {
      id: obj.id || `task-${i}`,
      title: obj.title || 'Untitled Task',
      description: obj.description || '',
      location: obj.location || 'Unknown',
      category: obj.category || 'General',
      lat: obj.lat ? Number.parseFloat(obj.lat) : undefined,
      lng: obj.lng ? Number.parseFloat(obj.lng) : undefined,
<<<<<<< HEAD
      required_skills: normalizeList(obj.required_skills),
      source_type: (obj.source_type?.toUpperCase() === 'PUBLIC' ? 'PUBLIC' : 'NGO') as 'PUBLIC'|'NGO',
      verification_status: obj.verification_status?.toUpperCase() === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED',
      priority_score: Number.parseFloat(obj.priority_score || '0') || 0,
      urgency_level: normalizeUrgency(obj.urgency_level) ?? 'LOW',
      status: normalizeStatus(obj.status),
      timestamp: obj.timestamp || obj.created_at || new Date().toISOString(),
      submitted_by: obj.submitted_by || 'ngo@email.com',
=======
      required_skills: normalizeList(obj.skills),
      source_type: obj.ngo_name ? 'NGO' : 'PUBLIC',
      verification_status: obj.verified === 'true' || obj.verified === 'TRUE' ? 'VERIFIED' : 'UNVERIFIED',
      priority_score: Number.parseFloat(obj.priority_score) || 0,
      urgency_level: normalizeUrgency(obj.priority_label) ?? 'LOW',
      status: normalizeStatus(obj.status),
      timestamp: obj.timestamp || obj.date || new Date().toISOString(),
      submitted_by: obj.email || 'ngo@email.com',
>>>>>>> d92358570aa9576e26cbd508d9d0358f4f2cfdd4
      assigned_to: obj.assigned_to || undefined,
    } as ReliefTask;
  }).sort((a, b) => b.priority_score - a.priority_score);

  return formatted;
};

// Format logic for Volunteers
const formatVolunteers = (rows: any[]): Volunteer[] => {
  if (!rows?.length) return [];

  const formatted = rows.map((obj, i) => {
    return {
      id: obj.id || `vol-${i}`,
      name: obj.name || obj.full_name || 'Unknown',
      email: obj.email || '',
      location: obj.location || 'Unknown',
      skills: normalizeList(obj.skills),
      availability: obj.availability || 'PART_TIME',
      tasks_completed: obj.tasks_completed || 0,
      rating: obj.rating ? Number.parseFloat(obj.rating) : 5.0
    } as Volunteer;
  });

  return formatted;
};

interface TaskStore {
  tasks: ReliefTask[];
  filteredTasks: ReliefTask[];
  volunteers: Volunteer[];
  isLoading: boolean;
  filters: {
    urgency: string | null;
    verification: string | null;
    status: string | null;
    search: string;
  };
  stats: DashboardStats;
  setTasks: (tasks: Omit<ReliefTask, 'id'>[]) => void;
  setFilter: (key: string, value: string | null) => void;
  setSearch: (search: string) => void;
  applyFilters: () => void;
  computeStats: () => void;
  updateTaskStatus: (taskId: string, status: ReliefTask['status']) => void;
  initializeMockData: () => void;
  loadCSVData: () => Promise<void>;
  matchVolunteer: (volunteer: Volunteer, tasksList?: ReliefTask[]) => ReliefTask[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  volunteers: [],
  isLoading: false,
  filters: { urgency: null, verification: null, status: null, search: '' },
  stats: { total_tasks: 0, critical_tasks: 0, verified_tasks: 0, unverified_tasks: 0, completed_tasks: 0, active_volunteers: 0 },

  setTasks: (tasks) => {
    set({ tasks: tasks as ReliefTask[] });
    get().applyFilters();
    get().computeStats();
  },

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
    get().applyFilters();
  },

  setSearch: (search) => {
    set((state) => ({ filters: { ...state.filters, search } }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { tasks, filters } = get();
    let filtered = [...tasks];

    if (filters.urgency) filtered = filtered.filter((t) => t.urgency_level === filters.urgency);
    if (filters.verification) filtered = filtered.filter((t) => t.verification_status === filters.verification);
    if (filters.status) filtered = filtered.filter((t) => t.status === filters.status);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s) || t.location.toLowerCase().includes(s));
    }

    filtered.sort((a, b) => b.priority_score - a.priority_score);
    set({ filteredTasks: filtered });
  },

  computeStats: () => {
    const { tasks, volunteers } = get();
    set({
      stats: {
        total_tasks: tasks.length,
        critical_tasks: tasks.filter((t) => t.urgency_level === 'CRITICAL').length,
        verified_tasks: tasks.filter((t) => t.verification_status === 'VERIFIED').length,
        unverified_tasks: tasks.filter((t) => t.verification_status === 'UNVERIFIED').length,
        completed_tasks: tasks.filter((t) => t.status === 'COMPLETED').length,
        active_volunteers: volunteers.length || 24,
      },
    });
  },

  updateTaskStatus: async (taskId, status) => {
    // Optimistic update locally
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
    get().applyFilters();
    get().computeStats();

    // Async push to Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserEmail = session?.user?.email || 'unknown_volunteer@email.com';

      // 1. Mark task as assigned
      await supabase.from('tasks').update({ status }).eq('id', taskId);

      // 2. Track internal volunteer assignment
      if (status === 'ASSIGNED') {
        await supabase.from('task_assignments').insert({
          task_id: taskId,
          volunteer_email: currentUserEmail,
          status: 'ASSIGNED'
        });
      }
    } catch (e) {
      console.error("Failed to update status in DB:", e);
    }
  },

  initializeMockData: () => {
    if (get().tasks.length === 0) {
      get().setTasks(mockTasks);
    }
    get().loadCSVData();
  },

  loadCSVData: async () => {
    console.log("[loadSupabaseData] Fetching from Supabase instead of CSV");
    set({ isLoading: true });
    try {
      const [tasksRes, volsRes, profilesRes] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('volunteers').select('*'),
        supabase.from('profiles').select('*').eq('role', 'volunteer')
      ]);

      // We combine 'volunteers' (piped via n8n) and 'profiles' (signed up locally)
      // to yield a robust list of all network volunteers!
      const allVolunteersData = [...(volsRes.data || []), ...(profilesRes.data || [])];
      
      const tasks = formatTasks(tasksRes.data || []);
      const volunteers = formatVolunteers(allVolunteersData);

      set(() => ({
        tasks: [...tasks],
        filteredTasks: [...tasks],
        volunteers: [...volunteers],
        isLoading: false,
      }));

      get().applyFilters();
      get().computeStats();
    } catch (e) {
      console.error("[loadSupabaseData] Error loading from Supabase:", e);
      set({ isLoading: false });
    }
  },

  matchVolunteer: (volunteer, tasksList) => {
    const tasks = tasksList || get().tasks;
    const volLoc = volunteer.location.trim().toLowerCase();
    return tasks
      .filter((task) => {
        if (task.status !== "OPEN") return false;
        const taskLoc = task.location.trim().toLowerCase();
        if (taskLoc !== volLoc) return false;
        return task.required_skills.some((skill) =>
          volunteer.skills.some((vSkill) => vSkill.trim().toLowerCase() === skill.trim().toLowerCase())
        );
      })
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, 3);
  },
}));
