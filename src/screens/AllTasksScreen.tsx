import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import Card from '../components/Card';
import Button from '../components/Button';
import TaskCompletionModal from '../components/TaskCompletionModal';
import { Task } from '../types';
import { t } from '../services/i18n';

export default function AllTasksScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { tasks, completeTask, categories } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const activeTasks = tasks.filter((task) => !task.isCompleted);

  const handleTaskPress = (taskId: string) => {
    // @ts-ignore
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleCompletePress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleConfirmComplete = async () => {
    if (selectedTask) {
      await completeTask(selectedTask.id);
      setModalVisible(false);
      setSelectedTask(null);
    }
  };

  const handleCancelComplete = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const renderTask = ({ item }: { item: Task }) => {
    const category = item.categoryId
      ? categories.find(c => c.id === item.categoryId)
      : null;

    const taskColor = item.color || category?.color;
    const showColorIndicator = taskColor && taskColor !== category?.color;

    return (
      <Card onPress={() => handleTaskPress(item.id)} style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <View style={styles.taskNameRow}>
              {category && (
                <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={14} color="#fff" />
                </View>
              )}
              {showColorIndicator && (
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              )}
              <Text style={styles.taskName}>{item.taskName}</Text>
            </View>
            <Text style={styles.taskXP}>+{item.experienceReward} XP</Text>
          </View>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={(e) => {
              e.stopPropagation();
              handleCompletePress(item);
            }}
          >
            <View style={styles.checkbox} />
          </TouchableOpacity>
        </View>
        {item.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.taskFooter}>
          {item.isRepeated && (
            <Text style={styles.repeatedTag}>
              🔁 {t(`tasks.frequencies.${item.frequency?.type}`)}
            </Text>
          )}
          {category && (
            <Text style={[styles.categoryTag, { color: taskColor || category.color }]}>
              {category.name}
            </Text>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('tasks.allTasks')}</Text>
      </View>

      {activeTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('tasks.noTasks')}</Text>
          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            {t('labels.createFirstTask')}
          </Text>
          <TouchableOpacity
            style={[styles.centeredButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('CreateTask');
            }}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.centeredButtonText}>{t('labels.createTask')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={activeTasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* FAB - Floating Action Button */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('CreateTask');
            }}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      <TaskCompletionModal
        visible={modalVisible}
        taskId={selectedTask?.id || ''}
        taskName={selectedTask?.taskName || ''}
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 24,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
  },
  taskNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  taskXP: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  repeatedTag: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkButton: {
    padding: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a9eff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  centeredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  centeredButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
