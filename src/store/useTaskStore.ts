import { create } from 'zustand';
import type { ReliefTask, DashboardStats } from '@/types';
import { mockTasks } from '@/data/mockData';

interface TaskStore {
  tasks: ReliefTask[];
  filteredTasks: ReliefTask[];
  isLoading: boolean;
  filters: {
    urgency: string | null;
    verification: string | null;
    status: string | null;
    search: string;
  };
  stats: DashboardStats;
  setTasks: (tasks: ReliefTask[]) => void;
  setFilter: (key: string, value: string | null) => void;
  setSearch: (search: string) => void;
  applyFilters: () => void;
  computeStats: () => void;
  updateTaskStatus: (taskId: string, status: ReliefTask['status']) => void;
  initializeMockData: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  isLoading: false,
  filters: { urgency: null, verification: null, status: null, search: '' },
  stats: { total_tasks: 0, critical_tasks: 0, verified_tasks: 0, unverified_tasks: 0, completed_tasks: 0, active_volunteers: 0 },

  setTasks: (tasks) => {
    set({ tasks });
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
    const { tasks } = get();
    set({
      stats: {
        total_tasks: tasks.length,
        critical_tasks: tasks.filter((t) => t.urgency_level === 'CRITICAL').length,
        verified_tasks: tasks.filter((t) => t.verification_status === 'VERIFIED').length,
        unverified_tasks: tasks.filter((t) => t.verification_status === 'UNVERIFIED').length,
        completed_tasks: tasks.filter((t) => t.status === 'COMPLETED').length,
        active_volunteers: 24,
      },
    });
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
    get().applyFilters();
    get().computeStats();
  },

  initializeMockData: () => {
    get().setTasks(mockTasks);
  },
}));
