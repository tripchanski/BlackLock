import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{t('errors.taskNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const category = task.categoryId ? categories.find(c => c.id === task.categoryId) : null;

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {t('labels.taskDetails') || 'Task Details'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{task.taskName}</Text>

        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {category && (
            <InfoRow
              label={t('labels.category')}
              value={category.isDefault ? t(`categories.${category.name.toLowerCase()}`) : category.name}
              theme={theme}
            />
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
        />
      </View>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
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
    padding: 16,
    borderTopWidth: 1,
    marginBottom: 90,
  },
});
