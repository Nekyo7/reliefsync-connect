import { create } from 'zustand';
import type { DashboardStats, ReliefTask, Volunteer } from '@/types';
import { fetchCSV, rowsToObjects } from '@/utils/csv';

const NGO_TASKS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTApZNaoVYT_W8C6H7ZBRlFQVa5Z_kW7dDfmFs13Xun8jXYT53MpGyVZ93-jg5Jqc4NXVCtqVXxX-kb/pub?output=csv';
const VOLUNTEERS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTApZNaoVYT_W8C6H7ZBRlFQVa5Z_kW7dDfmFs13Xun8jXYT53MpGyVZ93-jg5Jqc4NXVCtqVXxX-kb/pub?gid=820527332&single=true&output=csv';

const normalizeList = (value?: string) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const normalizeStatus = (value?: string): ReliefTask['status'] => {
  const normalized = value?.trim().toUpperCase().replace(/\s+/g, '_');
  if (normalized === 'ASSIGNED' || normalized === 'IN_PROGRESS' || normalized === 'COMPLETED') {
    return normalized;
  }
  return 'OPEN';
};

const normalizeVerification = (value?: string): ReliefTask['verification_status'] => {
  const normalized = value?.trim().toUpperCase();
  return normalized === 'UNVERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
};

const normalizeSource = (value?: string): ReliefTask['source_type'] => {
  const normalized = value?.trim().toUpperCase();
  return normalized === 'PUBLIC' ? 'PUBLIC' : 'NGO';
};

const normalizeUrgency = (value?: string): ReliefTask['urgency_level'] => {
  const normalized = value?.trim().toUpperCase();
  if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH' || normalized === 'CRITICAL') {
    return normalized;
  }
  return 'MEDIUM';
};

const computeFallbackPriority = (peopleValue?: string) => {
  const people = Number.parseInt(peopleValue || '0', 10) || 0;
  return (0.6 * 5) + (0.4 * Math.log(people + 1));
};

const structureTasks = (rows: Record<string, string>[]): ReliefTask[] =>
  rows
    .map((row, index) => {
      const fallbackPriority = computeFallbackPriority(row.volunteers_needed || row.people || row.people_affected);
      const parsedPriority = Number.parseFloat(row.priority_score || row.priority || '');
      const priorityScore = Number.isFinite(parsedPriority) ? parsedPriority : fallbackPriority;
      const urgencyLevel = normalizeUrgency(row.priority_label || row.urgency_level || row.urgency);

      return {
        id: row.id || `task-${row.timestamp || row.title || index}`,
        title: row.title || 'Untitled Task',
        description: row.description || row.details || '',
        location: row.location || 'Unknown',
        lat: row.lat ? Number.parseFloat(row.lat) : row.latitude ? Number.parseFloat(row.latitude) : undefined,
        lng: row.lng ? Number.parseFloat(row.lng) : row.longitude ? Number.parseFloat(row.longitude) : undefined,
        category: row.category || 'General',
        required_skills: normalizeList(row.skills || row.required_skills),
        timestamp: row.timestamp || new Date().toISOString(),
        source_type: normalizeSource(row.source_type),
        verification_status: normalizeVerification(row.verification_status),
        priority_score: priorityScore,
        urgency_level: urgencyLevel,
        status: normalizeStatus(row.status),
        assigned_to: row.assigned_to || undefined,
        submitted_by: row.submitted_by || row.email || undefined,
      } satisfies ReliefTask;
    })
    .sort((a, b) => b.priority_score - a.priority_score);

const normalizeAvailability = (value?: string): Volunteer['availability'] => {
  const normalized = value?.trim().toUpperCase().replace(/\s+/g, '_');
  if (normalized === 'FULL_TIME' || normalized === 'PART_TIME' || normalized === 'WEEKENDS' || normalized === 'ON_CALL') {
    return normalized;
  }
  return 'PART_TIME';
};

const structureVolunteers = (rows: Record<string, string>[]): Volunteer[] =>
  rows.map((row, index) => {
    const name = row.name || row.full_name || 'Unknown';
    const email = row.email || '';
    return {
      id: row.id || `vol-${email || name}-${index}`,
      name,
      email,
      location: row.location || 'Unknown',
      skills: normalizeList(row.skills),
      availability: normalizeAvailability(row.availability),
      tasks_completed: Number.parseInt(row.tasks_completed || '0', 10) || 0,
      rating: Number.parseFloat(row.rating || '5') || 5,
    } satisfies Volunteer;
  });

interface TaskStore {
  tasks: ReliefTask[];
  filteredTasks: ReliefTask[];
  volunteers: Volunteer[];
  isLoading: boolean;
  error: string | null;
  filters: {
    urgency: string | null;
    verification: string | null;
    status: string | null;
    search: string;
  };
  stats: DashboardStats;
  rawTaskRows: string[][];
  rawVolunteerRows: string[][];
  setFilter: (key: string, value: string | null) => void;
  setSearch: (search: string) => void;
  applyFilters: () => void;
  computeStats: () => void;
  updateTaskStatus: (taskId: string, status: ReliefTask['status'], assignedTo?: string) => void;
  loadCSVData: () => Promise<void>;
  matchVolunteer: (volunteer: Pick<Volunteer, 'location' | 'skills'>, tasksList?: ReliefTask[]) => (ReliefTask & { match_score: number })[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  volunteers: [],
  isLoading: false,
  error: null,
  filters: { urgency: null, verification: null, status: null, search: '' },
  stats: { total_tasks: 0, critical_tasks: 0, verified_tasks: 0, unverified_tasks: 0, completed_tasks: 0, active_volunteers: 0 },
  rawTaskRows: [],
  rawVolunteerRows: [],

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

    if (filters.urgency) filtered = filtered.filter((task) => task.urgency_level === filters.urgency);
    if (filters.verification) filtered = filtered.filter((task) => task.verification_status === filters.verification);
    if (filters.status) filtered = filtered.filter((task) => task.status === filters.status);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.location.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => b.priority_score - a.priority_score);
    set({ filteredTasks: filtered });
  },

  computeStats: () => {
    const { tasks, volunteers } = get();

    set({
      stats: {
        total_tasks: tasks.length,
        critical_tasks: tasks.filter((task) => task.urgency_level === 'CRITICAL').length,
        verified_tasks: tasks.filter((task) => task.verification_status === 'VERIFIED').length,
        unverified_tasks: tasks.filter((task) => task.verification_status === 'UNVERIFIED').length,
        completed_tasks: tasks.filter((task) => task.status === 'COMPLETED').length,
        active_volunteers: volunteers.length,
      },
    });
  },

  updateTaskStatus: (taskId, status, assignedTo) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              assigned_to: assignedTo ?? task.assigned_to,
            }
          : task
      ),
    }));
    get().applyFilters();
    get().computeStats();
  },

  loadCSVData: async () => {
    set({ isLoading: true, error: null });

    try {
      const [{ rows: taskRows }, { rows: volunteerRows }] = await Promise.all([
        fetchCSV(NGO_TASKS_CSV_URL, 'NGO Tasks'),
        fetchCSV(VOLUNTEERS_CSV_URL, 'Volunteers'),
      ]);

      const structuredTasks = structureTasks(rowsToObjects(taskRows));
      const structuredVolunteers = structureVolunteers(rowsToObjects(volunteerRows));

      set({
        rawTaskRows: taskRows,
        rawVolunteerRows: volunteerRows,
        tasks: structuredTasks,
        filteredTasks: structuredTasks,
        volunteers: structuredVolunteers,
        isLoading: false,
      });

      get().applyFilters();
      get().computeStats();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load CSV data.';
      console.error('[loadCSVData] Failed:', error);
      set({ isLoading: false, error: message });
    }
  },

  matchVolunteer: (volunteer, tasksList) => {
    const tasks = tasksList || get().tasks;
    const volunteerLocation = volunteer.location.trim().toLowerCase();
    const volunteerSkills = volunteer.skills.map((skill) => skill.trim().toLowerCase());

    const getSkillMatches = (task: ReliefTask) =>
      task.required_skills.filter((skill) => volunteerSkills.includes(skill.trim().toLowerCase())).length;

    // Skill score: reward more overlaps, cap to 1.
    const getSkillScore = (task: ReliefTask) => {
      const matches = getSkillMatches(task);
      const denom = Math.max(1, task.required_skills.length);
      return Math.min(1, matches / denom);
    };

    const getLocationScore = (task: ReliefTask) => {
      const taskLocation = task.location.trim().toLowerCase();
      if (!taskLocation || !volunteerLocation) return 0;
      return taskLocation.includes(volunteerLocation) || volunteerLocation.includes(taskLocation) ? 1 : 0;
    };

    // MVP: availability is not yet used to filter or weight.
    const getAvailabilityScore = () => 1;

    const getPriorityNormalized = (task: ReliefTask) => {
      const value = Number.isFinite(task.priority_score) ? task.priority_score : 0;
      return value / 5;
    };

    const calculateScore = (task: ReliefTask) => {
      const skill = getSkillScore(task);
      const location = getLocationScore(task);
      const availability = getAvailabilityScore();
      const priorityNormalized = getPriorityNormalized(task);

      return skill * 0.4 + location * 0.3 + availability * 0.1 + priorityNormalized * 0.2;
    };

    return tasks
      .filter((task) => task.status === 'OPEN')
      .map((task) => ({
        ...task,
        match_score: calculateScore(task),
      }))
      .sort((a, b) => b.match_score - a.match_score || getSkillMatches(b) - getSkillMatches(a) || b.priority_score - a.priority_score)
      .slice(0, 3);
  },
}));
