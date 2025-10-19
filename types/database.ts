export type TaskCategory = 'work' | 'study' | 'life' | 'other' | string;
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface User {
  id: string;
  email?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  estimated_pomodoros: number;
  actual_pomodoros: number;
  planned_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  task_id?: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  completed_at?: string;
}
