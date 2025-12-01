import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
  RootStackParamList,
  MainTabParamList,
  TasksStackParamList,
  SettingsStackParamList,
} from './types';
import { useStore } from '../services/store';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import AllTasksScreen from '../screens/AllTasksScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import FocusScreen from '../screens/FocusScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import CustomizeSettingsScreen from '../screens/CustomizeSettingsScreen';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';
import BackupSettingsScreen from '../screens/BackupSettingsScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function MainTabs() {
  const theme = useTheme();
  const { settings } = useStore();

  return (
    <MainTab.Navigator
      key={settings.language}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 16,
          marginBottom: 16,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          position: 'absolute',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Tasks"
        component={TasksStackNavigator}
        options={{
          tabBarLabel: t('navigation.tasks'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Focus"
        component={FocusScreen}
        options={{
          tabBarLabel: t('navigation.focus'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

// Tasks stack navigator
function TasksStackNavigator() {
  return (
    <TasksStack.Navigator screenOptions={{ headerShown: false }}>
      <TasksStack.Screen name="AllTasks" component={AllTasksScreen} />
      <TasksStack.Screen name="CreateTask" component={CreateTaskScreen} />
      <TasksStack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </TasksStack.Navigator>
  );
}

function SettingsStackNavigator() {
  const theme = useTheme();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.primary,
        headerTitleStyle: {
          color: theme.text,
        },
        headerShadowVisible: false,
      }}
    >
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <SettingsStack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: t('settings.account'),
        }}
      />
      <SettingsStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          title: t('settings.notifications'),
        }}
      />
      <SettingsStack.Screen
        name="CustomizeSettings"
        component={CustomizeSettingsScreen}
        options={{
          title: t('settings.customize'),
        }}
      />
      <SettingsStack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{
          title: t('settings.language'),
        }}
      />
      <SettingsStack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
        options={{
          title: t('settings.security'),
        }}
      />
      <SettingsStack.Screen
        name="BackupSettings"
        component={BackupSettingsScreen}
        options={{
          title: t('settings.backup'),
        }}
      />
    </SettingsStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isFirstLaunch, account } = useStore();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <>
            <RootStack.Screen name="Welcome" component={WelcomeScreen} />
            <RootStack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <RootStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          </>
        ) : (
          <RootStack.Screen name="Main" component={MainTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
