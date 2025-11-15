import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';
import { ThemeMode, ThemeColor } from '../types';

export default function CustomizeSettingsScreen() {
  const { settings, setSettings } = useStore();
  const theme = useTheme();

  const themeModes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: t('settings.light'), icon: '☀️' },
    { value: 'dark', label: t('settings.dark'), icon: '🌙' },
    { value: 'auto', label: t('settings.auto'), icon: '🔄' },
  ];

  const themeColors: { value: ThemeColor; label: string; color: string }[] = [
    { value: 'blue', label: 'Blue', color: '#58a6ff' },
    { value: 'purple', label: 'Purple', color: '#a78bfa' },
    { value: 'green', label: 'Green', color: '#3fb950' },
    { value: 'orange', label: 'Orange', color: '#fb923c' },
    { value: 'red', label: 'Red', color: '#f85149' },
    { value: 'pink', label: 'Pink', color: '#f472b6' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('settings.themeMode')}</Text>
      <View style={styles.modeContainer}>
        {themeModes.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            style={[
              styles.modeOption,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
              settings.theme.mode === mode.value && {
                borderColor: theme.primary,
                backgroundColor: theme.primaryLight + '20',
              },
            ]}
            onPress={() => setSettings({ theme: { ...settings.theme, mode: mode.value } })}
          >
            <Text style={styles.modeIcon}>{mode.icon}</Text>
            <Text
              style={[
                styles.modeText,
                { color: theme.textSecondary },
                settings.theme.mode === mode.value && { color: theme.primary },
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('settings.accentColor')}</Text>
      <View style={styles.colorContainer}>
        {themeColors.map((color) => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles.colorOption,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
              settings.theme.color === color.value && {
                borderColor: color.color,
                borderWidth: 3,
              },
            ]}
            onPress={() => setSettings({ theme: { ...settings.theme, color: color.value } })}
          >
            <View style={[styles.colorCircle, { backgroundColor: color.color }]} />
            <Text
              style={[
                styles.colorText,
                { color: theme.textSecondary },
                settings.theme.color === color.value && { color: theme.text },
              ]}
            >
              {color.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeOption: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  colorOption: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '32%',
    aspectRatio: 1.2,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
