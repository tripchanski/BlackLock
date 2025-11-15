import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Task, AppSettings, Category } from '../types';
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

  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

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

  // Backup/Restore
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  theme: {
    mode: 'dark',
    color: 'blue',
  },
  notifications: {
    enabled: true,
    frequency: 'instant',
    taskReminders: true,
    levelUpNotifications: true,
  },
  pomodoroSettings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
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

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),

  loadCategories: async () => {
    try {
      const categories = await database.getAllCategories();
      set({ categories });
    } catch (error) {
      console.error('Error loading categories:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to load categories',
        data: { error: String(error) },
      });
    }
  },

  addCategory: async (category) => {
    try {
      await database.createCategory(category);
      await get().loadCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to create category',
        data: { error: String(error) },
      });
    }
  },

  updateCategory: async (id, updates) => {
    try {
      await database.updateCategory(id, updates);
      await get().loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to update category',
        data: { error: String(error) },
      });
    }
  },

  deleteCategory: async (id) => {
    try {
      await database.deleteCategory(id);
      await get().loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      await database.addLog({
        type: 'error',
        message: 'Failed to delete category',
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
      console.log('Loading categories...');
      await get().loadCategories();
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

  // Export all data
  exportData: async () => {
    try {
      const jsonData = await database.exportData();
      return jsonData;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  },

  // Import data and reload state
  importData: async (jsonData: string) => {
    try {
      await database.importData(jsonData);

      // Reload all data after import
      await get().loadAccount();
      await get().loadCategories();
      await get().loadTasks();

      console.log('✅ Data imported and reloaded successfully');
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  },
}));
