import { Category } from '../types';

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Work',
    icon: 'briefcase',
    color: '#3b82f6',
    isDefault: true,
  },
  {
    name: 'Personal',
    icon: 'person',
    color: '#8b5cf6',
    isDefault: true,
  },
  {
    name: 'Health',
    icon: 'fitness',
    color: '#10b981',
    isDefault: true,
  },
  {
    name: 'Learning',
    icon: 'book',
    color: '#f59e0b',
    isDefault: true,
  },
  {
    name: 'Home',
    icon: 'home',
    color: '#06b6d4',
    isDefault: true,
  },
  {
    name: 'Shopping',
    icon: 'cart',
    color: '#ec4899',
    isDefault: true,
  },
  {
    name: 'Finance',
    icon: 'cash',
    color: '#14b8a6',
    isDefault: true,
  },
  {
    name: 'Social',
    icon: 'people',
    color: '#f97316',
    isDefault: true,
  },
];


export const AVAILABLE_ICONS = [
  'star',
  'heart',
  'trophy',
  'rocket',
  'bulb',
  'musical-notes',
  'game-controller',
  'restaurant',
  'cafe',
  'bicycle',
  'car',
  'airplane',
  'camera',
  'code',
  'construct',
  'flask',
  'basketball',
  'football',
  'barbell',
  'water',
  'leaf',
  'pizza',
  'gift',
  'umbrella',
  'sunny',
  'moon',
];


export const AVAILABLE_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#10b981', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#a855f7', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
];
