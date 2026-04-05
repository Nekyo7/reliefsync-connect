export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED';
export type TaskStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
export type SourceType = 'NGO' | 'PUBLIC';

export interface ReliefTask {
  id: string;
  title: string;
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  category: string;
  required_skills: string[];
  timestamp: string;
  source_type: SourceType;
  verification_status: VerificationStatus;
  priority_score: number;
  urgency_level: UrgencyLevel;
  status: TaskStatus;
  assigned_to?: string;
  submitted_by?: string;
  processed_timestamp?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  location: string;
  lat?: number;
  lng?: number;
  skills: string[];
  availability: 'FULL_TIME' | 'PART_TIME' | 'WEEKENDS' | 'ON_CALL';
  tasks_completed: number;
  rating: number;
}

export interface TaskFeedback {
  id: string;
  task_id: string;
  volunteer_id: string;
  difficulty: number;
  time_taken: string;
  comments: string;
  created_at: string;
}

export interface DashboardStats {
  total_tasks: number;
  critical_tasks: number;
  verified_tasks: number;
  unverified_tasks: number;
  completed_tasks: number;
  active_volunteers: number;
}
