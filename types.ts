
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Category {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  FAMILY = 'FAMILY',
  HEALTH = 'HEALTH'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string; // HH:mm format
  date: string; // YYYY-MM-DD
  priority: Priority;
  category: Category;
  completed: boolean;
  isScheduled: boolean;
}

export type ViewType = 'DASHBOARD' | 'CREATE' | 'EDIT' | 'DETAIL' | 'CALENDAR' | 'PROFILE';

export interface AIResponse {
  title: string;
  description?: string;
  time?: string;
  priority: Priority;
  category: Category;
}
