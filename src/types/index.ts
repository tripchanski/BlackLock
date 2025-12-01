// Database Types

export interface Account {
  id: string;
  avatar?: string;
  characterType?: string;
  name?: string;
  nickname: string;
  level: number;
  experience: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentFolderId?: string; // For nested folders
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  taskName: string;
  description: string;
  categoryId?: string;
  folderId?: string;
  color?: string;
  isCompleted: boolean;
  isRepeated: boolean;
  frequency?: TaskFrequency;
  experienceReward: number;
  deadline?: string; // ISO datetime string
  notificationMinutes?: number[]; // [30, 60, 1440] - minutes before deadline
  order?: number; // For drag & drop ordering
  createdAt: number;
  updatedAt: number;
}

export interface TaskFrequency {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  customDays?: number;
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


export interface NotificationSettings {
  enabled: boolean;
  frequency: 'instant' | 'hourly' | 'daily';
  taskReminders: boolean;
  levelUpNotifications: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';
export type FolderViewMode = 'list' | 'grid';

export type SupportedLanguage = 'en' | 'uk' | 'ru' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'hi' | 'ar' | 'pt' | 'id' | 'bn' | 'ur' | 'az' | 'tr';

export interface AppSettings {
  language: SupportedLanguage;
  theme: {
    mode: ThemeMode;
    color: ThemeColor;
  };
  notifications: NotificationSettings;
  taskCompletionPin?: string;
  pomodoroSettings: PomodoroSettings;
  folderView: FolderViewMode;
}

export interface MotivationalQuote {
  id: string;
  text: string;
  language: SupportedLanguage;
  type: 'warning' | 'encouragement' | 'reminder';
}

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskName?: string;
  phase: PomodoroPhase;
  duration: number;
  completedAt: string;
}


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
