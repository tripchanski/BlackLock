import { ThemeColor } from '../types';

export interface Theme {
  background: string;
  surface: string;
  surfaceLight: string;
  border: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  success: string;
  error: string;
  warning: string;
}

export const DARK_THEMES: Record<ThemeColor, Theme> = {
  blue: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceLight: '#1f2937',
    border: '#30363d',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    primary: '#58a6ff',
    primaryLight: '#388bfd',
    success: '#3fb950',
    error: '#f85149',
    warning: '#d29922',
  },
  purple: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceLight: '#1f2937',
    border: '#30363d',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    primary: '#a78bfa',
    primaryLight: '#c4b5fd',
    success: '#3fb950',
    error: '#f85149',
    warning: '#d29922',
  },
  green: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceLight: '#1f2937',
    border: '#30363d',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    primary: '#3fb950',
    primaryLight: '#56d364',
    success: '#3fb950',
    error: '#f85149',
    warning: '#d29922',
  },
  orange: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceLight: '#1f2937',
    border: '#30363d',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    primary: '#fb923c',
    primaryLight: '#fdba74',
    success: '#3fb950',
    error: '#f85149',
    warning: '#d29922',
  },
  red: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceLight: '#1f2937',
    border: '#30363d',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    primary: '#f85149',
    primaryLight: '#ff7b72',
    success: '#3fb950',
    error: '#f85149',
    warning: '#d29922',
  },
  pink: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceLight: '#1f2937',
    border: '#30363d',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    primary: '#f472b6',
    primaryLight: '#f9a8d4',
    success: '#3fb950',
    error: '#f85149',
    warning: '#d29922',
  },
};

export const LIGHT_THEMES: Record<ThemeColor, Theme> = {
  blue: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceLight: '#ffffff',
    border: '#d0d7de',
    text: '#24292f',
    textSecondary: '#57606a',
    textTertiary: '#6e7781',
    primary: '#0969da',
    primaryLight: '#218bff',
    success: '#1a7f37',
    error: '#cf222e',
    warning: '#9a6700',
  },
  purple: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceLight: '#ffffff',
    border: '#d0d7de',
    text: '#24292f',
    textSecondary: '#57606a',
    textTertiary: '#6e7781',
    primary: '#8250df',
    primaryLight: '#a371f7',
    success: '#1a7f37',
    error: '#cf222e',
    warning: '#9a6700',
  },
  green: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceLight: '#ffffff',
    border: '#d0d7de',
    text: '#24292f',
    textSecondary: '#57606a',
    textTertiary: '#6e7781',
    primary: '#1a7f37',
    primaryLight: '#2da44e',
    success: '#1a7f37',
    error: '#cf222e',
    warning: '#9a6700',
  },
  orange: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceLight: '#ffffff',
    border: '#d0d7de',
    text: '#24292f',
    textSecondary: '#57606a',
    textTertiary: '#6e7781',
    primary: '#ea580c',
    primaryLight: '#fb923c',
    success: '#1a7f37',
    error: '#cf222e',
    warning: '#9a6700',
  },
  red: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceLight: '#ffffff',
    border: '#d0d7de',
    text: '#24292f',
    textSecondary: '#57606a',
    textTertiary: '#6e7781',
    primary: '#cf222e',
    primaryLight: '#ff7b72',
    success: '#1a7f37',
    error: '#cf222e',
    warning: '#9a6700',
  },
  pink: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceLight: '#ffffff',
    border: '#d0d7de',
    text: '#24292f',
    textSecondary: '#57606a',
    textTertiary: '#6e7781',
    primary: '#db2777',
    primaryLight: '#ec4899',
    success: '#1a7f37',
    error: '#cf222e',
    warning: '#9a6700',
  },
};

export function getTheme(mode: 'light' | 'dark', color: ThemeColor): Theme {
  return mode === 'dark' ? DARK_THEMES[color] : LIGHT_THEMES[color];
}
