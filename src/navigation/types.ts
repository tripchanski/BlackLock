import { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: NavigatorScreenParams<TasksStackParamList>;
  Focus: undefined;
  Statistics: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type TasksStackParamList = {
  AllTasks: undefined;
  CreateTask: undefined;
  TaskDetail: { taskId: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  CustomizeSettings: undefined;
};

export type NavigatorScreenParams<T> = {
  screen?: keyof T;
  params?: T[keyof T];
};

export type AppNavigationProp = NavigationProp<RootStackParamList & MainTabParamList & TasksStackParamList & SettingsStackParamList>;
