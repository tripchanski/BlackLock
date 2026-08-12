import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { TaskType, TaskFrequency } from '../types';
import { t } from '../services/i18n';

export default function CreateTaskScreen() {
  const navigation = useNavigation();
  const { addTask } = useStore();

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('knowledge');
  const [isRepeated, setIsRepeated] = useState(false);
  const [frequencyType, setFrequencyType] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [loading, setLoading] = useState(false);

  const taskTypes: TaskType[] = ['strength', 'knowledge', 'wisdom', 'endurance', 'charisma'];

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    setLoading(true);
    try {
      const frequency: TaskFrequency | undefined = isRepeated
        ? { type: frequencyType }
        : undefined;

      await addTask({
        taskName: taskName.trim(),
        description: description.trim(),
        type,
        isCompleted: false,
        isRepeated,
        frequency,
        experienceReward: 10,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('tasks.createTask')}</Text>

        <Input
          label={t('tasks.taskName')}
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Enter task name"
        />

        <Input
          label={t('tasks.description')}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>{t('tasks.type')}</Text>
        <View style={styles.typeContainer}>
          {taskTypes.map((taskType) => (
            <TouchableOpacity
              key={taskType}
              style={[
                styles.typeOption,
                type === taskType && styles.typeOptionSelected,
              ]}
              onPress={() => setType(taskType)}
            >
              <Text
                style={[
                  styles.typeText,
                  type === taskType && styles.typeTextSelected,
                ]}
              >
                {t(`tasks.types.${taskType}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.repeatToggle}
          onPress={() => setIsRepeated(!isRepeated)}
        >
          <View style={[styles.checkbox, isRepeated && styles.checkboxChecked]}>
            {isRepeated && <View style={styles.checkmark} />}
          </View>
          <Text style={styles.repeatText}>{t('tasks.repeated')}</Text>
        </TouchableOpacity>

        {isRepeated && (
          <>
            <Text style={styles.label}>{t('tasks.frequency')}</Text>
            <View style={styles.frequencyContainer}>
              {['daily', 'weekly', 'monthly'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    frequencyType === freq && styles.frequencyOptionSelected,
                  ]}
                  onPress={() => setFrequencyType(freq as any)}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      frequencyType === freq && styles.frequencyTextSelected,
                    ]}
                  >
                    {t(`tasks.frequencies.${freq}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.footerButton}
        />
        <Button
          title={t('common.save')}
          onPress={handleCreateTask}
          disabled={!taskName.trim()}
          loading={loading}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 48,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  typeOption: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  typeOptionSelected: {
    borderColor: '#4a9eff',
    backgroundColor: '#1a3a5a',
  },
  typeText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  typeTextSelected: {
    color: '#4a9eff',
  },
  repeatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4a9eff',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a9eff',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  repeatText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  frequencyOptionSelected: {
    borderColor: '#4a9eff',
    backgroundColor: '#1a3a5a',
  },
  frequencyText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  frequencyTextSelected: {
    color: '#4a9eff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  footerButton: {
    flex: 1,
  },
});
