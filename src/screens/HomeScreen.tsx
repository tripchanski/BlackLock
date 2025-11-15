import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../services/store';
import Card from '../components/Card';
import { t } from '../services/i18n';
import { RANKS } from '../types';
import { useTheme } from '../hooks/useTheme';

export default function HomeScreen() {
  const { account, tasks } = useStore();
  const theme = useTheme();

  if (!account) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{t('errors.noAccount')}</Text>
      </View>
    );
  }

  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const activeTasks = tasks.filter((task) => !task.isCompleted).length;
  const currentRank = RANKS.find(
    (rank) => account.level >= rank.minLevel && account.level <= rank.maxLevel
  );

  // Get translated rank name
  const getRankName = (rank: typeof RANKS[0] | undefined) => {
    if (!rank) return t('ranks.novice');
    const rankKey = rank.name.toLowerCase() as 'novice' | 'apprentice' | 'adept' | 'expert' | 'master' | 'legend';
    return t(`ranks.${rankKey}`);
  };

  const nextLevel = account.level + 1;
  const experienceForNextLevel = nextLevel * nextLevel * 100;
  const experienceProgress =
    (account.experience / experienceForNextLevel) * 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>
          {t('home.welcome', { nickname: account.nickname })}
        </Text>
        <Text style={[styles.rankText, { color: theme.primary }]}>{getRankName(currentRank)}</Text>
      </View>

      {/* Character Card */}
      <Card style={styles.characterCard}>
        <View style={styles.levelContainer}>
          <Text style={[styles.levelText, { color: theme.text }]}>
            {t('home.level', { level: account.level })}
          </Text>
        </View>

        <View style={[styles.experienceBar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.experienceProgress,
              { width: `${Math.min(experienceProgress, 100)}%`, backgroundColor: theme.primary },
            ]}
          />
        </View>
        <Text style={[styles.experienceText, { color: theme.textSecondary }]}>
          {t('home.experience', {
            current: account.experience,
            next: experienceForNextLevel,
          })}
        </Text>
      </Card>

      {/* Tasks Overview */}
      <View style={styles.overviewContainer}>
        <Card style={styles.overviewCard}>
          <Text style={[styles.overviewValue, { color: theme.primary }]}>{activeTasks}</Text>
          <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{t('labels.activeTasks')}</Text>
        </Card>
        <Card style={styles.overviewCard}>
          <Text style={[styles.overviewValue, { color: theme.primary }]}>{completedTasks}</Text>
          <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{t('labels.completed')}</Text>
        </Card>
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
    marginBottom: 8,
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
});
