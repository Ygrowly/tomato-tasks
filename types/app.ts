import { Task } from './database';

// Timer related types
export type TimerMode = 'work' | 'short_break' | 'long_break';

export interface TimerState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  mode: TimerMode;
  currentTaskId: string | null;
  completedPomodoros: number;
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  intervalsUntilLongBreak: number;
}

// Stats related types
export interface DailyStats {
  date: string;
  completedPomodoros: number;
  completedTasks: number;
  totalFocusTime: number; // in minutes
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

// Today's focus related types
export interface TodayFocus {
  tasks: Task[];
  completedPomodoros: number;
  plannedPomodoros: number;
  completedTasks: number;
  totalTasks: number;
}
