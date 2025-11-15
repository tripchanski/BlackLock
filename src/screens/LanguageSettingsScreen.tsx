import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';
import { SupportedLanguage } from '../types';

export default function LanguageSettingsScreen() {
  const { settings, setSettings } = useStore();
  const theme = useTheme();

  const languages: Array<{ code: SupportedLanguage; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' },
    { code: 'pt', name: 'Português' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ur', name: 'اردو' },
    { code: 'az', name: 'Azərbaycan' },
    { code: 'tr', name: 'Türkçe' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          activeOpacity={0.7}
          style={[
            styles.optionItem,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
            settings.language === lang.code && {
              borderColor: theme.primary,
              backgroundColor: theme.primaryLight + '20',
            },
          ]}
          onPress={() => setSettings({ language: lang.code })}
        >
          <Text
            style={[
              styles.optionText,
              { color: theme.textSecondary },
              settings.language === lang.code && { color: theme.primary },
            ]}
          >
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}
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
  optionItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
