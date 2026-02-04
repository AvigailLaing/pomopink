
export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: SubTask[];
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

export interface DailyStats {
  pomodorosCompleted: number;
  totalFocusedTime: number; // in milliseconds
  lastUpdated: string; // ISO date to reset daily
}

export interface HabitLog {
  id: string;
  timestamp: number;
  mode: TimerMode;
  note?: string;
}

export interface HabitTracker {
  id: string;
  name: string;
  emoji: string;
  history: HabitLog[];
}
