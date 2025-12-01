import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../services/store';
import Card from '../components/Card';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function StatisticsScreen() {
  const { account, tasks } = useStore();
  const theme = useTheme();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{t('statistics.title')}</Text>

      {/* Overview Cards */}
      <View style={styles.overviewContainer}>
        <Card style={styles.overviewCard}>
          <Text style={[styles.overviewValue, { color: theme.primary }]}>{totalTasks}</Text>
          <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{t('statistics.totalTasks')}</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={[styles.overviewValue, { color: theme.primary }]}>{completedTasks}</Text>
          <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{t('statistics.completedTasks')}</Text>
        </Card>
      </View>

      <View style={styles.overviewContainer}>
        <Card style={styles.overviewCard}>
          <Text style={[styles.overviewValue, { color: theme.primary }]}>{activeTasks}</Text>
          <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{t('statistics.activeTasks')}</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={[styles.overviewValue, { color: theme.primary }]}>{completionRate}%</Text>
          <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{t('statistics.completionRate')}</Text>
        </Card>
      </View>

      {/* Level Progress */}
      {account && (
        <Card style={styles.levelCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('statistics.levelProgress')}</Text>
          <View style={styles.levelInfo}>
            <Text style={[styles.levelText, { color: theme.primary }]}>Level {account.level}</Text>
            <Text style={[styles.experienceText, { color: theme.textSecondary }]}>{account.experience} XP</Text>
          </View>
        </Card>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  overviewContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  overviewCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  overviewValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsCard: {
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    width: 90,
    fontSize: 14,
    fontWeight: '600',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    width: 30,
    fontSize: 14,
    textAlign: 'right',
  },
  levelCard: {
    padding: 20,
    marginBottom: 24,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  experienceText: {
    fontSize: 18,
  },
});
