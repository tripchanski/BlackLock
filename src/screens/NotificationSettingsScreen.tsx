import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const { settings, setSettings } = useStore();
  const theme = useTheme();

  const handleToggle = async (key: keyof typeof settings.notifications, value: boolean) => {
    await setSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: theme.text }]}>{t('settings.notifications')}</Text>

      <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>Enable Notifications</Text>
        <Switch
          value={settings.notifications.enabled}
          onValueChange={(value) => handleToggle('enabled', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={theme.text}
        />
      </View>

      <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{t('settings.taskReminders')}</Text>
        <Switch
          value={settings.notifications.taskReminders}
          onValueChange={(value) => handleToggle('taskReminders', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={theme.text}
          disabled={!settings.notifications.enabled}
        />
      </View>

      <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{t('settings.levelUpNotifications')}</Text>
        <Switch
          value={settings.notifications.levelUpNotifications}
          onValueChange={(value) => handleToggle('levelUpNotifications', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={theme.text}
          disabled={!settings.notifications.enabled}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 48,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
