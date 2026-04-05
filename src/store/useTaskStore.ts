import { create } from 'zustand';
import type { ReliefTask, DashboardStats, Volunteer } from '@/types';
import { mockTasks } from '@/data/mockData';

const NGO_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTApZNaoVYT_W8C6H7ZBRlFQVa5Z_kW7dDfmFs13Xun8jXYT53MpGyVZ93-jg5Jqc4NXVCtqVXxX-kb/pub?output=csv";
const VOL_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTApZNaoVYT_W8C6H7ZBRlFQVa5Z_kW7dDfmFs13Xun8jXYT53MpGyVZ93-jg5Jqc4NXVCtqVXxX-kb/pub?gid=820527332&single=true&output=csv";

const normalizeCell = (value: string) => value.replace(/^\uFEFF/, '').trim();

const isRowEmpty = (row: string[]) => row.every((cell) => normalizeCell(cell) === '');

// Robust CSV parser that safely handles commas, escaped quotes, and quoted newlines.
const parseCSV = (rawText: string): string[][] => {
  const text = rawText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(normalizeCell(currentCell));
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }

      currentRow.push(normalizeCell(currentCell));
      if (!isRowEmpty(currentRow)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(normalizeCell(currentCell));
    if (!isRowEmpty(currentRow)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const mapRowsToObjects = (rows: string[][], label: string) => {
  if (rows.length === 0) {
    console.log(`[Parsed Rows - ${label}] No rows found after parsing.`);
    return [];
  }

  const headers = rows[0].map((header) => normalizeCell(header).toLowerCase());
  const dataRows = rows
    .slice(1)
    .map((row) => headers.map((_, index) => normalizeCell(row[index] ?? '')))
    .filter((row) => !isRowEmpty(row));

  const structuredRows = dataRows.map((row, rowIndex) =>
    headers.reduce<Record<string, string>>((accumulator, header, headerIndex) => {
      const fallbackKey = `column_${headerIndex}`;
      accumulator[header || fallbackKey] = row[headerIndex] ?? '';
      return accumulator;
    }, { __rowIndex: String(rowIndex) })
  );

  console.log(`[Parsed Rows - ${label}]`, rows);
  console.log(`[Final Structured Data - ${label}]`, structuredRows);

  return structuredRows;
};

const normalizeList = (value?: string) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const normalizeStatus = (value?: string): ReliefTask['status'] => {
  const normalized = value?.trim().toUpperCase().replace(/\s+/g, "_");
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

const normalizeUrgency = (value?: string): ReliefTask['urgency_level'] | null => {
  const normalized = value?.trim().toUpperCase();
  if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH' || normalized === 'CRITICAL') {
    return normalized;
  }
  return null;
};

// Helper to fetch CSV with cache-busting
const fetchCSV = async (url: string, label: string) => {
  const finalUrl = new URL(url);
  finalUrl.searchParams.set('_ts', Date.now().toString());

  console.log(`[Fetch ${label}] URL`, finalUrl.toString());

  const response = await fetch(finalUrl.toString(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`${label} CSV request failed with ${response.status}`);
  }

  const text = await response.text();
  console.log(`[Raw CSV Text - ${label}]`, text);

  return mapRowsToObjects(parseCSV(text), label);
};

// Priority formula
function getPriority(task: any) {
  const peopleInt = parseInt(task.people) || 0;
  return (0.6 * 5) + (0.4 * Math.log(peopleInt + 1));
}

// Format logic for Tasks
const formatTasks = (rows: Record<string, string>[]): ReliefTask[] => {
  if (!rows.length) return [];

  const formatted = rows.map((obj, i) => {
    const peopleValue = obj.volunteers_needed || obj.people || obj.people_affected || "0";
    const fallbackPriority = getPriority({ people: peopleValue });
    const parsedPriority = Number.parseFloat(obj.priority_score || obj.priority || '');
    const taskPriority = Number.isFinite(parsedPriority) ? parsedPriority : fallbackPriority;
    const derivedUrgency = normalizeUrgency(obj.urgency_level || obj.urgency) ?? (taskPriority > 3.5 ? 'CRITICAL' : taskPriority > 3.2 ? 'HIGH' : 'MEDIUM');

    return {
      id: `task-${obj.timestamp || obj.title || 'row'}-${i}`,
      title: obj.title || 'Untitled Task',
      description: obj.description || '',
      location: obj.location || 'Unknown',
      category: obj.category || 'General',
      lat: obj.lat ? Number.parseFloat(obj.lat) : obj.latitude ? Number.parseFloat(obj.latitude) : undefined,
      lng: obj.lng ? Number.parseFloat(obj.lng) : obj.longitude ? Number.parseFloat(obj.longitude) : undefined,
      required_skills: normalizeList(obj.skills || obj.required_skills),
      source_type: normalizeSource(obj.source_type),
      verification_status: normalizeVerification(obj.verification_status),
      priority_score: taskPriority,
      urgency_level: derivedUrgency,
      status: normalizeStatus(obj.status),
      timestamp: obj.timestamp || new Date().toISOString(),
      assigned_to: obj.assigned_to || undefined,
    } as ReliefTask & { people: number };
  }).sort((a, b) => b.priority_score - a.priority_score);

  console.log('[Final Structured Tasks]:', formatted);
  return formatted;
};

// Format logic for Volunteers
const formatVolunteers = (rows: Record<string, string>[]): Volunteer[] => {
  if (!rows.length) return [];

  const formatted = rows.map((obj, i) => {
    return {
      id: `vol-${obj.email || obj.name || 'row'}-${i}`,
      name: obj.name || 'Unknown',
      email: obj.email || '',
      location: obj.location || 'Unknown',
      skills: normalizeList(obj.skills),
      availability: 'PART_TIME',
      tasks_completed: 0,
      rating: 5
    } as Volunteer;
  });

  console.log('[Final Structured Volunteers]:', formatted);
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

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
    get().applyFilters();
    get().computeStats();
  },

  initializeMockData: () => {
    if (get().tasks.length === 0) {
      get().setTasks(mockTasks);
    }
    get().loadCSVData();
  },

  loadCSVData: async () => {
    console.log("[loadCSVData] Started fetching live data...");
    set({ isLoading: true });
    try {
      const [ngoRows, volRows] = await Promise.all([
        fetchCSV(NGO_URL, "NGO"),
        fetchCSV(VOL_URL, "Volunteers")
      ]);
      const tasks = formatTasks(ngoRows);
      const volunteers = formatVolunteers(volRows);

      console.log("[loadCSVData] Next task payload", tasks);
      console.log("[loadCSVData] Next volunteer payload", volunteers);

      set(() => ({
        tasks: [...tasks],
        filteredTasks: [...tasks],
        volunteers: [...volunteers],
        isLoading: false,
      }));

      const updatedState = get();
      console.log("[loadCSVData] State successfully updated with new data", {
        taskCount: updatedState.tasks.length,
        volunteerCount: updatedState.volunteers.length,
      });

      get().applyFilters();
      get().computeStats();
    } catch (e) {
      console.error("[loadCSVData] Error loading CSV:", e);
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
