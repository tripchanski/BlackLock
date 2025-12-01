import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Task, AppSettings, Category, Folder } from '../types';
import { storage } from './storage';
import { notificationService } from './notifications';

interface AppState {
  // Account
  account: Account | null;
  setAccount: (account: Account | null) => void;
  loadAccount: () => Promise<void>;
  createAccount: (data: { nickname: string; name?: string; level: number; experience: number }) => Promise<void>;
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

  // Folders
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  loadFolders: () => Promise<void>;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  updateTaskOrders: (tasks: { id: string; order: number; folderId?: string }[]) => Promise<void>;

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
  folderView: 'list',
};

// Debounced save functions
let saveTimeout: NodeJS.Timeout | null = null;

const debouncedSave = <T>(filename: string, data: T, delay: number = 1000) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(async () => {
    try {
      await storage.save(filename, data);
    } catch (error) {
      console.error(`Failed to save ${filename}:`, error);
    }
  }, delay);
};

// Helper to generate UUID
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const useStore = create<AppState>((set, get) => ({
  // Account
  account: null,
  setAccount: (account) => set({ account }),

  loadAccount: async () => {
    try {
      const account = await storage.load<Account | null>('account.json', null);
      set({ account });
    } catch (error) {
      console.error('Error loading account:', error);
    }
  },

  createAccount: async (data) => {
    try {
      const newAccount: Account = {
        id: generateId(),
        nickname: data.nickname,
        name: data.name,
        level: data.level,
        experience: data.experience,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      set({ account: newAccount });
      await storage.save('account.json', newAccount);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  updateAccount: async (updates) => {
    try {
      const currentAccount = get().account;
      if (!currentAccount) return;

      const updatedAccount = { ...currentAccount, ...updates };
      set({ account: updatedAccount });
      await storage.save('account.json', updatedAccount);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  },

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),

  loadTasks: async () => {
    try {
      const tasks = await storage.load<Task[]>('tasks.json', []);
      set({ tasks });
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  },

  addTask: async (task) => {
    try {
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isCompleted: false,
        order: get().tasks.length,
      };

      const updatedTasks = [...get().tasks, newTask];
      set({ tasks: updatedTasks });
      debouncedSave('tasks.json', updatedTasks);

      // Schedule notifications if task has deadline
      if (newTask.deadline && newTask.notificationMinutes) {
        const settings = get().settings;
        await notificationService.scheduleTaskNotifications(newTask, settings.language);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const updatedTasks = get().tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
      );
      set({ tasks: updatedTasks });
      debouncedSave('tasks.json', updatedTasks);

      // Update notifications if deadline or notificationMinutes changed
      if (updates.deadline !== undefined || updates.notificationMinutes !== undefined) {
        const task = updatedTasks.find((t) => t.id === id);
        if (task && task.deadline && task.notificationMinutes) {
          await notificationService.cancelTaskNotifications(id);
          const settings = get().settings;
          await notificationService.scheduleTaskNotifications(task, settings.language);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  deleteTask: async (id) => {
    try {
      // Cancel any scheduled notifications for this task
      await notificationService.cancelTaskNotifications(id);

      const updatedTasks = get().tasks.filter((task) => task.id !== id);
      set({ tasks: updatedTasks });
      debouncedSave('tasks.json', updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },

  completeTask: async (id) => {
    try {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;

      // Cancel notifications for this task
      await notificationService.cancelTaskNotifications(id);

      // Update task as completed
      const updatedTasks = get().tasks.map((t) =>
        t.id === id ? { ...t, isCompleted: true, updatedAt: Date.now() } : t
      );
      set({ tasks: updatedTasks });
      debouncedSave('tasks.json', updatedTasks);

      // Update account XP and level
      const account = get().account;
      if (account) {
        const xpReward = task.experienceReward || 10;
        const newExperience = account.experience + xpReward;
        const newLevel = Math.floor(Math.sqrt(newExperience / 100)) + 1;

        const updatedAccount = {
          ...account,
          experience: newExperience,
          level: newLevel,
        };

        set({ account: updatedAccount });
        await storage.save('account.json', updatedAccount);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  },

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),

  loadCategories: async () => {
    try {
      const categories = await storage.load<Category[]>('categories.json', []);
      set({ categories });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  },

  addCategory: async (category) => {
    try {
      const newCategory: Category = {
        ...category,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedCategories = [...get().categories, newCategory];
      set({ categories: updatedCategories });
      debouncedSave('categories.json', updatedCategories);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const updatedCategories = get().categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates, updatedAt: Date.now() } : cat
      );
      set({ categories: updatedCategories });
      debouncedSave('categories.json', updatedCategories);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  },

  deleteCategory: async (id) => {
    try {
      const updatedCategories = get().categories.filter((cat) => cat.id !== id);
      set({ categories: updatedCategories });
      debouncedSave('categories.json', updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },

  // Folders
  folders: [],
  setFolders: (folders) => set({ folders }),

  loadFolders: async () => {
    try {
      const folders = await storage.load<Folder[]>('folders.json', []);
      set({ folders });
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  },

  addFolder: async (folder) => {
    try {
      const newFolder: Folder = {
        ...folder,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: get().folders.length,
      };

      const updatedFolders = [...get().folders, newFolder];
      set({ folders: updatedFolders });
      debouncedSave('folders.json', updatedFolders);
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  },

  updateFolder: async (id, updates) => {
    try {
      const updatedFolders = get().folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates, updatedAt: Date.now() } : folder
      );
      set({ folders: updatedFolders });
      debouncedSave('folders.json', updatedFolders);
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  },

  deleteFolder: async (id) => {
    try {
      // Remove folder reference from tasks
      const updatedTasks = get().tasks.map((task) =>
        task.folderId === id ? { ...task, folderId: undefined, updatedAt: Date.now() } : task
      );

      const updatedFolders = get().folders.filter((folder) => folder.id !== id);

      set({ tasks: updatedTasks, folders: updatedFolders });
      debouncedSave('tasks.json', updatedTasks);
      debouncedSave('folders.json', updatedFolders);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  },

  updateTaskOrders: async (taskUpdates) => {
    try {
      const taskMap = new Map(taskUpdates.map((t) => [t.id, t]));
      const updatedTasks = get().tasks.map((task) => {
        const update = taskMap.get(task.id);
        if (update) {
          return {
            ...task,
            order: update.order,
            folderId: update.folderId !== undefined ? update.folderId : task.folderId,
            updatedAt: Date.now(),
          };
        }
        return task;
      });

      set({ tasks: updatedTasks });
      debouncedSave('tasks.json', updatedTasks);
    } catch (error) {
      console.error('Error updating task orders:', error);
    }
  },

  // Settings
  settings: DEFAULT_SETTINGS,

  setSettings: async (updates) => {
    try {
      const updatedSettings = { ...get().settings, ...updates };
      set({ settings: updatedSettings });
      await AsyncStorage.setItem('app-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  loadSettings: async () => {
    try {
      const settingsJson = await AsyncStorage.getItem('app-settings');
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        set({ settings: { ...DEFAULT_SETTINGS, ...settings } });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  // App State
  isFirstLaunch: true,

  setIsFirstLaunch: async (value) => {
    set({ isFirstLaunch: value });
    await AsyncStorage.setItem('first-launch', value ? 'true' : 'false');
  },

  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),

  // Initialize
  initialize: async () => {
    try {
      set({ isLoading: true });

      // Initialize storage
      await storage.init();

      // Load first launch flag
      const firstLaunch = await AsyncStorage.getItem('first-launch');
      set({ isFirstLaunch: firstLaunch !== 'false' });

      // Load all data
      await Promise.all([
        get().loadAccount(),
        get().loadTasks(),
        get().loadCategories(),
        get().loadFolders(),
        get().loadSettings(),
      ]);

      console.log('✅ Store initialized successfully');
      set({ isLoading: false });
    } catch (error) {
      console.error('❌ Failed to initialize store:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Backup/Restore
  exportData: async () => {
    try {
      const { tasks, account, settings, categories, folders } = get();

      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        account,
        tasks,
        categories,
        folders,
        settings,
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  importData: async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);

      // Validate data structure
      if (!data.version || !data.account) {
        throw new Error('Invalid backup format');
      }

      // Create backup before importing
      await storage.createBackup();

      // Import data
      set({
        account: data.account || null,
        tasks: data.tasks || [],
        categories: data.categories || [],
        folders: data.folders || [],
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
      });

      // Save to storage
      await Promise.all([
        storage.save('account.json', data.account),
        storage.save('tasks.json', data.tasks || []),
        storage.save('categories.json', data.categories || []),
        storage.save('folders.json', data.folders || []),
        AsyncStorage.setItem('app-settings', JSON.stringify(data.settings || DEFAULT_SETTINGS)),
      ]);

      console.log('✅ Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },
}));
