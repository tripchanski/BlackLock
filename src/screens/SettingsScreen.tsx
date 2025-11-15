import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const settingsSections = [
    { title: t('settings.account'), screen: 'AccountSettings', icon: '👤' },
    { title: t('settings.notifications'), screen: 'NotificationSettings', icon: '🔔' },
    { title: t('settings.customize'), screen: 'CustomizeSettings', icon: '🎨' },
    { title: t('settings.language'), screen: 'LanguageSettings', icon: '🌍' },
    { title: t('settings.security'), screen: 'SecuritySettings', icon: '🔒' },
    { title: t('settings.backup'), screen: 'BackupSettings', icon: '💾' },
  ];

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/tripchanski/BlackLock');
  };

  const handleKoFiPress = () => {
    Linking.openURL('https://ko-fi.com/tripchanski');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: theme.text }]}>{t('settings.title')}</Text>

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
          <Text style={[styles.settingText, { color: theme.text }]}>{section.title}</Text>
          <Text style={[styles.arrow, { color: theme.textSecondary }]}>›</Text>
        </Card>
      ))}

      <View style={styles.linksSection}>
        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={handleGitHubPress}
        >
          <Text style={styles.linkIcon}>⭐</Text>
          <Text style={[styles.linkText, { color: theme.text }]}>GitHub</Text>
          <Text style={[styles.linkUrl, { color: theme.textSecondary }]}>tripchanski/BlackLock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={handleKoFiPress}
        >
          <Text style={styles.linkIcon}>☕</Text>
          <Text style={[styles.linkText, { color: theme.text }]}>Support on Ko-fi</Text>
          <Text style={[styles.linkUrl, { color: theme.textSecondary }]}>ko-fi.com/tripchanski</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appInfo}>
        <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>{t('labels.appVersion')}</Text>
        <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>{t('labels.openSource')}</Text>
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
  },
  arrow: {
    fontSize: 28,
  },
  linksSection: {
    marginTop: 32,
    gap: 12,
  },
  linkButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkIcon: {
    fontSize: 24,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  linkUrl: {
    fontSize: 12,
  },
  appInfo: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
