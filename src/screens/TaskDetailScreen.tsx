import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../services/store';
import Button from '../components/Button';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params as { taskId: string };
  const { tasks, categories, completeTask, deleteTask } = useStore();
  const theme = useTheme();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{t('errors.taskNotFound')}</Text>
      </View>
    );
  }

  const category = task.categoryId ? categories.find(c => c.id === task.categoryId) : null;

  const handleComplete = () => {
    Alert.alert(
      t('warnings.confirmComplete'),
      `Complete "${task.taskName}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            await completeTask(taskId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t('warnings.deleteTask'),
      `Delete "${task.taskName}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{task.taskName}</Text>

        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {category && (
            <InfoRow label={t('labels.category')} value={category.name} theme={theme} />
          )}
          <InfoRow label={t('labels.experienceReward')} value={`+${task.experienceReward} XP`} theme={theme} />
          {task.isRepeated && (
            <InfoRow
              label={t('labels.frequency')}
              value={t(`tasks.frequencies.${task.frequency?.type}`)}
              theme={theme}
            />
          )}
        </View>

        {task.description && (
          <View style={[styles.descriptionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('labels.description')}</Text>
            <Text style={[styles.description, { color: theme.text }]}>{task.description}</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title={t('common.delete')}
          onPress={handleDelete}
          variant="danger"
          style={styles.footerButton}
        />
        <Button
          title={t('tasks.complete')}
          onPress={handleComplete}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

function InfoRow({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 48,
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});
