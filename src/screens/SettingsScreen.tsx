import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import { t } from '../services/i18n';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const settingsSections = [
    { title: t('settings.account'), screen: 'AccountSettings', icon: '👤' },
    { title: t('settings.notifications'), screen: 'NotificationSettings', icon: '🔔' },
    { title: t('settings.customize'), screen: 'CustomizeSettings', icon: '🎨' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      {settingsSections.map((section) => (
        <Card
          key={section.screen}
          onPress={() => {
            // @ts-ignore
            navigation.navigate(section.screen);
          }}
          style={styles.settingCard}
        >
          <Text style={styles.icon}>{section.icon}</Text>
          <Text style={styles.settingText}>{section.title}</Text>
          <Text style={styles.arrow}>›</Text>
        </Card>
      ))}

      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>BlackLock v1.0.0</Text>
        <Text style={styles.appInfoText}>Open Source Project</Text>
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
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  arrow: {
    fontSize: 28,
    color: '#888',
  },
  appInfo: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
