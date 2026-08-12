import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import Card from '../components/Card';
import Button from '../components/Button';
import { Task } from '../types';
import { t } from '../services/i18n';

export default function AllTasksScreen() {
  const navigation = useNavigation();
  const { tasks, completeTask } = useStore();

  const activeTasks = tasks.filter((task) => !task.isCompleted);

  const handleTaskPress = (taskId: string) => {
    // @ts-ignore
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card onPress={() => handleTaskPress(item.id)} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>{item.taskName}</Text>
          <Text style={styles.taskType}>
            {t(`tasks.types.${item.type}`)} • +{item.experienceReward} XP
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => handleCompleteTask(item.id)}
        >
          <View style={styles.checkbox} />
        </TouchableOpacity>
      </View>
      {item.description && (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      {item.isRepeated && (
        <Text style={styles.repeatedTag}>
          🔁 {t(`tasks.frequencies.${item.frequency?.type}`)}
        </Text>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('tasks.allTasks')}</Text>
        <Button
          title="+"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('CreateTask');
          }}
          style={styles.addButton}
        />
      </View>

      {activeTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('tasks.noTasks')}</Text>
          <Text style={styles.emptySubtext}>Create your first task to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={activeTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 0,
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
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  taskType: {
    fontSize: 14,
    color: '#4a9eff',
  },
  taskDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  repeatedTag: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
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
    color: '#888',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
