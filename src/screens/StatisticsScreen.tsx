import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../services/store';
import Card from '../components/Card';
import { t } from '../services/i18n';

export default function StatisticsScreen() {
  const { account, tasks } = useStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('statistics.title')}</Text>

      {/* Overview Cards */}
      <View style={styles.overviewContainer}>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{totalTasks}</Text>
          <Text style={styles.overviewLabel}>{t('statistics.totalTasks')}</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{completedTasks}</Text>
          <Text style={styles.overviewLabel}>{t('statistics.completedTasks')}</Text>
        </Card>
      </View>

      <View style={styles.overviewContainer}>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{activeTasks}</Text>
          <Text style={styles.overviewLabel}>Active Tasks</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{completionRate}%</Text>
          <Text style={styles.overviewLabel}>Completion Rate</Text>
        </Card>
      </View>

      {/* Character Stats */}
      {account && (
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>{t('statistics.characterStats')}</Text>
          <StatBar label="Strength" value={account.stats.strength} color="#ff6b6b" />
          <StatBar label="Knowledge" value={account.stats.knowledge} color="#4ecdc4" />
          <StatBar label="Wisdom" value={account.stats.wisdom} color="#a78bfa" />
          <StatBar label="Endurance" value={account.stats.endurance} color="#ffd93d" />
          <StatBar label="Charisma" value={account.stats.charisma} color="#ff85b3" />
        </Card>
      )}

      {/* Level Progress */}
      {account && (
        <Card style={styles.levelCard}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {account.level}</Text>
            <Text style={styles.experienceText}>{account.experience} XP</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxValue = 100;
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <View style={styles.statBar}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarContainer}>
        <View style={[styles.statBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
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
    color: '#4a9eff',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  statsCard: {
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#fff',
    fontWeight: '600',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#3a3a3a',
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
    color: '#888',
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
    color: '#4a9eff',
  },
  experienceText: {
    fontSize: 18,
    color: '#888',
  },
});
