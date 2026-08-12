// Database Types

export interface Account {
  id: string;
  avatar?: string;
  characterType?: string;
  name?: string;
  nickname: string;
  level: number;
  experience: number;
  stats: CharacterStats;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterStats {
  strength: number;
  knowledge: number;
  wisdom: number;
  endurance: number;
  charisma: number;
}

export type TaskType = 'strength' | 'knowledge' | 'wisdom' | 'endurance' | 'charisma';

export interface Task {
  id: string;
  taskName: string;
  description: string;
  type: TaskType;
  isCompleted: boolean;
  isRepeated: boolean;
  frequency?: TaskFrequency;
  experienceReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFrequency {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;
  customDays?: number; // Every N days
}

export interface Log {
  id: string;
  type: 'error' | 'warning' | 'analytics';
  message: string;
  data?: any;
  timestamp: string;
}

export interface AnalyticsData {
  usersValue: number;
  functionUsageCount: Record<string, number>;
  timeSpentInApp: number;
  errors: string[];
  warnings: string[];
}

// Settings Types

export interface NotificationSettings {
  enabled: boolean;
  frequency: 'instant' | 'hourly' | 'daily';
  taskReminders: boolean;
  levelUpNotifications: boolean;
}

export interface AppSettings {
  language: 'en' | 'uk' | 'ru';
  darkMode: boolean;
  textSize: 'small' | 'medium' | 'large';
  notifications: NotificationSettings;
}

// Navigation Types

export type RootStackParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  Main: undefined;
  Home: undefined;
  Tasks: undefined;
  AllTasks: undefined;
  CreateTask: undefined;
  TaskDetail: { taskId: string };
  Focus: undefined;
  Settings: undefined;
  SettingsMain: undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  CustomizeSettings: undefined;
  Statistics: undefined;
};

// Rank System

export interface Rank {
  id: number;
  name: string;
  minLevel: number;
  maxLevel: number;
  specialChallenge?: string;
}

export const RANKS: Rank[] = [
  { id: 1, name: 'Novice', minLevel: 1, maxLevel: 10 },
  { id: 2, name: 'Apprentice', minLevel: 11, maxLevel: 25 },
  { id: 3, name: 'Adept', minLevel: 26, maxLevel: 50 },
  { id: 4, name: 'Expert', minLevel: 51, maxLevel: 75 },
  { id: 5, name: 'Master', minLevel: 76, maxLevel: 100 },
  { id: 6, name: 'Legend', minLevel: 101, maxLevel: Infinity },
];
