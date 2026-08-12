import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../services/store';
import Card from '../components/Card';
import { t } from '../services/i18n';
import { RANKS } from '../types';

export default function HomeScreen() {
  const { account, tasks } = useStore();

  if (!account) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No account found</Text>
      </View>
    );
  }

  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const activeTasks = tasks.filter((task) => !task.isCompleted).length;
  const currentRank = RANKS.find(
    (rank) => account.level >= rank.minLevel && account.level <= rank.maxLevel
  );
  const nextLevel = account.level + 1;
  const experienceForNextLevel = nextLevel * nextLevel * 100;
  const experienceProgress =
    (account.experience / experienceForNextLevel) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {t('home.welcome', { nickname: account.nickname })}
        </Text>
        <Text style={styles.rankText}>{currentRank?.name || 'Novice'}</Text>
      </View>

      {/* Character Card */}
      <Card style={styles.characterCard}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>
            {t('home.level', { level: account.level })}
          </Text>
        </View>

        <View style={styles.experienceBar}>
          <View
            style={[
              styles.experienceProgress,
              { width: `${Math.min(experienceProgress, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.experienceText}>
          {t('home.experience', {
            current: account.experience,
            next: experienceForNextLevel,
          })}
        </Text>

        {/* Character Stats */}
        <View style={styles.statsContainer}>
          <StatBar label="Strength" value={account.stats.strength} color="#ff6b6b" />
          <StatBar label="Knowledge" value={account.stats.knowledge} color="#4ecdc4" />
          <StatBar label="Wisdom" value={account.stats.wisdom} color="#a78bfa" />
          <StatBar label="Endurance" value={account.stats.endurance} color="#ffd93d" />
          <StatBar label="Charisma" value={account.stats.charisma} color="#ff85b3" />
        </View>
      </Card>

      {/* Tasks Overview */}
      <View style={styles.overviewContainer}>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{activeTasks}</Text>
          <Text style={styles.overviewLabel}>Active Tasks</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{completedTasks}</Text>
          <Text style={styles.overviewLabel}>Completed</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Card style={styles.actionCard}>
          <Text style={styles.actionText}>Daily Quests</Text>
          <Text style={styles.actionSubtext}>Complete your daily tasks</Text>
        </Card>
        <Card style={styles.actionCard}>
          <Text style={styles.actionText}>Weekly Challenge</Text>
          <Text style={styles.actionSubtext}>Rank up challenge</Text>
        </Card>
      </View>
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
  header: {
    marginTop: 48,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  rankText: {
    fontSize: 18,
    color: '#4a9eff',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4a4a',
    fontSize: 16,
    textAlign: 'center',
  },
  characterCard: {
    padding: 20,
  },
  levelContainer: {
    marginBottom: 16,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  experienceBar: {
    height: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  experienceProgress: {
    height: '100%',
    backgroundColor: '#4a9eff',
    borderRadius: 6,
  },
  experienceText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  statsContainer: {
    marginTop: 12,
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
  overviewContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 14,
    color: '#888',
  },
});
