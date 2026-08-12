import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import { t } from '../services/i18n';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const { settings, setSettings } = useStore();

  const handleToggle = async (key: keyof typeof settings.notifications, value: boolean) => {
    await setSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('settings.notifications')}</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={settings.notifications.enabled}
          onValueChange={(value) => handleToggle('enabled', value)}
          trackColor={{ false: '#3a3a3a', true: '#4a9eff' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{t('settings.taskReminders')}</Text>
        <Switch
          value={settings.notifications.taskReminders}
          onValueChange={(value) => handleToggle('taskReminders', value)}
          trackColor={{ false: '#3a3a3a', true: '#4a9eff' }}
          thumbColor="#fff"
          disabled={!settings.notifications.enabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{t('settings.levelUpNotifications')}</Text>
        <Switch
          value={settings.notifications.levelUpNotifications}
          onValueChange={(value) => handleToggle('levelUpNotifications', value)}
          trackColor={{ false: '#3a3a3a', true: '#4a9eff' }}
          thumbColor="#fff"
          disabled={!settings.notifications.enabled}
        />
      </View>
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
});
