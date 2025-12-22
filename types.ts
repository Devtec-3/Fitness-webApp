
export enum TaskCategory {
  WORK = 'Work',
  HEALTH = 'Health',
  PERSONAL = 'Personal',
  LEISURE = 'Leisure',
  CHORE = 'Chore'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string; 
  durationMinutes: number;
  category: TaskCategory;
  status: TaskStatus;
  location?: string;
  url?: string;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
}

export interface HealthNews {
  title: string;
  summary: string;
  url: string;
  timestamp: string;
}

export interface CalorieData {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  advice: string;
}

export interface UserProfile {
  name: string;
  energyLevel: number;
  goals: string[];
  preferences: string;
}
