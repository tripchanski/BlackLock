import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Task, AppSettings } from '../types';
import { database } from './database';

interface AppState {
  // Account
  account: Account | null;
  setAccount: (account: Account | null) => void;
  loadAccount: () => Promise<void>;
  updateAccount: (updates: Partial<Account>) => Promise<void>;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;

  // Settings
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;

  // App State
  isFirstLaunch: boolean;
  setIsFirstLaunch: (value: boolean) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  // Initialize
  initialize: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  darkMode: false,
  textSize: 'medium',
  notifications: {
    enabled: true,
    frequency: 'instant',
    taskReminders: true,
    levelUpNotifications: true,
  },
};

export const useStore = create<AppState>((set, get) => ({
  // Account
  account: null,
  setAccount: (account) => set({ account }),

  loadAccount: async () => {
    try {
      const account = await database.getAccount();
      set({ account });
    } catch (error) {
      console.error('Error loading account:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to load account',
        data: { error: String(error) },
      });
    }
  },

  updateAccount: async (updates) => {
    try {
      await database.updateAccount(updates);
      await get().loadAccount();
    } catch (error) {
      console.error('Error updating account:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to update account',
        data: { error: String(error) },
      });
    }
  },

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),

  loadTasks: async () => {
    try {
      const tasks = await database.getAllTasks();
      set({ tasks });
    } catch (error) {
      console.error('Error loading tasks:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to load tasks',
        data: { error: String(error) },
      });
    }
  },

  addTask: async (task) => {
    try {
      await database.createTask(task);
      await get().loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to add task',
        data: { error: String(error) },
      });
    }
  },

  updateTask: async (id, updates) => {
    try {
      await database.updateTask(id, updates);
      await get().loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to update task',
        data: { error: String(error) },
      });
    }
  },

  deleteTask: async (id) => {
    try {
      await database.deleteTask(id);
      await get().loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to delete task',
        data: { error: String(error) },
      });
    }
  },

  completeTask: async (id) => {
    try {
      await database.completeTask(id);
      await get().loadTasks();
      await get().loadAccount();
    } catch (error) {
      console.error('Error completing task:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to complete task',
        data: { error: String(error) },
      });
    }
  },

  // Settings
  settings: DEFAULT_SETTINGS,

  setSettings: async (updates) => {
    try {
      const newSettings = { ...get().settings, ...updates };
      await AsyncStorage.setItem('app-settings', JSON.stringify(newSettings));
      set({ settings: newSettings });
    } catch (error) {
      console.error('Error saving settings:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to save settings',
        data: { error: String(error) },
      });
    }
  },

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem('app-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        set({ settings: { ...DEFAULT_SETTINGS, ...settings } });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to load settings',
        data: { error: String(error) },
      });
    }
  },

  // App State
  isFirstLaunch: true,
  setIsFirstLaunch: async (value) => {
    try {
      await AsyncStorage.setItem('first-launch', String(value));
      set({ isFirstLaunch: value });
    } catch (error) {
      console.error('Error setting first launch:', error);
    }
  },

  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),

  // Initialize
  initialize: async () => {
    try {
      console.log('Starting app initialization...');
      set({ isLoading: true });

      // Initialize database
      console.log('Initializing database...');
      await database.init();
      console.log('Database initialized');

      // Check if first launch
      console.log('Checking first launch...');
      const firstLaunch = await AsyncStorage.getItem('first-launch');
      set({ isFirstLaunch: firstLaunch !== 'false' });
      console.log('First launch:', firstLaunch !== 'false');

      // Load data
      console.log('Loading settings...');
      await get().loadSettings();
      console.log('Loading account...');
      await get().loadAccount();
      console.log('Loading tasks...');
      await get().loadTasks();

      console.log('App initialization complete');
      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing app:', error);
      set({ isLoading: false });
      // Don't try to log to database if initialization failed
    }
  },
}));
