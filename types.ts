
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}
