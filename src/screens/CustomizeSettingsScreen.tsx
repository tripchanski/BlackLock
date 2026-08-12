import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import { t } from '../services/i18n';

export default function CustomizeSettingsScreen() {
  const navigation = useNavigation();
  const { settings, setSettings } = useStore();

  const languages = [
    { code: 'en' as const, name: 'English' },
    { code: 'uk' as const, name: 'Українська' },
    { code: 'ru' as const, name: 'Русский' },
  ];

  const textSizes = [
    { value: 'small' as const, label: 'Small' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'large' as const, label: 'Large' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('settings.customize')}</Text>

      {/* Dark Mode */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
        <Switch
          value={settings.darkMode}
          onValueChange={(value) => setSettings({ darkMode: value })}
          trackColor={{ false: '#3a3a3a', true: '#4a9eff' }}
          thumbColor="#fff"
        />
      </View>

      {/* Language */}
      <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.optionItem,
            settings.language === lang.code && styles.optionItemSelected,
          ]}
          onPress={() => setSettings({ language: lang.code })}
        >
          <Text
            style={[
              styles.optionText,
              settings.language === lang.code && styles.optionTextSelected,
            ]}
          >
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Text Size */}
      <Text style={styles.sectionTitle}>{t('settings.textSize')}</Text>
      {textSizes.map((size) => (
        <TouchableOpacity
          key={size.value}
          style={[
            styles.optionItem,
            settings.textSize === size.value && styles.optionItemSelected,
          ]}
          onPress={() => setSettings({ textSize: size.value })}
        >
          <Text
            style={[
              styles.optionText,
              settings.textSize === size.value && styles.optionTextSelected,
            ]}
          >
            {size.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 48,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  optionItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionItemSelected: {
    borderColor: '#4a9eff',
    backgroundColor: '#1a3a5a',
  },
  optionText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#4a9eff',
  },
});
