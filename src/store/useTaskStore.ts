import { create } from 'zustand';
import type { DashboardStats, ReliefTask, Volunteer } from '@/types';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTApZNaoVYT_W8C6H7ZBRlFQVa5Z_kW7dDfmFs13Xun8jXYT53MpGyVZ93-jg5Jqc4NXVCtqVXxX-kb/pub?output=csv";

const normalizeCell = (value: string) => value.replace(/^\uFEFF/, '').trim();

const isRowEmpty = (row: string[]) => row.every((cell) => normalizeCell(cell) === '');

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

const rowsToObjects = (rows: string[][]) => {
  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => normalizeCell(header).toLowerCase());

  return rows
    .slice(1)
    .map((row) => headers.map((_, index) => normalizeCell(row[index] ?? '')))
    .filter((row) => !isRowEmpty(row))
    .map((row) =>
      headers.reduce<Record<string, string>>((accumulator, header, index) => {
        accumulator[header || `column_${index}`] = row[index] ?? '';
        return accumulator;
      }, {})
    );
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
      } satisfies ReliefTask;
    })
    .sort((a, b) => b.priority_score - a.priority_score);

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
  rawRows: string[][];
  setFilter: (key: string, value: string | null) => void;
  setSearch: (search: string) => void;
  applyFilters: () => void;
  computeStats: () => void;
  updateTaskStatus: (taskId: string, status: ReliefTask['status'], assignedTo?: string) => void;
  loadCSVData: () => Promise<void>;
  matchVolunteer: (volunteer: Pick<Volunteer, 'location' | 'skills'>, tasksList?: ReliefTask[]) => ReliefTask[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  isLoading: false,
  filters: { urgency: null, verification: null, status: null, search: '' },
  stats: { total_tasks: 0, critical_tasks: 0, verified_tasks: 0, unverified_tasks: 0, completed_tasks: 0, active_volunteers: 0 },
  rawRows: [],

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
    const { tasks } = get();
    const activeVolunteerSet = new Set(tasks.map((task) => task.assigned_to).filter(Boolean));

    set({
      stats: {
        total_tasks: tasks.length,
        critical_tasks: tasks.filter((task) => task.urgency_level === 'CRITICAL').length,
        verified_tasks: tasks.filter((task) => task.verification_status === 'VERIFIED').length,
        unverified_tasks: tasks.filter((task) => task.verification_status === 'UNVERIFIED').length,
        completed_tasks: tasks.filter((task) => task.status === 'COMPLETED').length,
        active_volunteers: activeVolunteerSet.size,
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
    console.log('[fetchTasks] Loading live CSV...');
    set({ isLoading: true });

    try {
      const response = await fetch(`${CSV_URL}&_ts=${Date.now()}`, { cache: 'no-store' });
      const text = await response.text();

      console.log('[Raw CSV Text]:', text);

      const parsedRows = parseCSV(text);
      console.log('[Parsed Rows]:', parsedRows);

      const structuredTasks = structureTasks(rowsToObjects(parsedRows));
      console.log('[Final Structured Data]:', structuredTasks);

      set({
        rawRows: parsedRows,
        tasks: structuredTasks,
        filteredTasks: structuredTasks,
        isLoading: false,
      });

      get().applyFilters();
      get().computeStats();
    } catch (error) {
      console.error('[fetchTasks] Failed to load CSV:', error);
      set({ isLoading: false });
    }
  },

  matchVolunteer: (volunteer, tasksList) => {
    const tasks = tasksList || get().tasks;
    const volunteerLocation = volunteer.location.trim().toLowerCase();
    const volunteerSkills = volunteer.skills.map((skill) => skill.trim().toLowerCase());

    return tasks
      .filter((task) => task.status === 'OPEN')
      .filter((task) => task.location.trim().toLowerCase() === volunteerLocation)
      .filter((task) =>
        task.required_skills.some((skill) => volunteerSkills.includes(skill.trim().toLowerCase()))
      )
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, 3);
  },
}));
