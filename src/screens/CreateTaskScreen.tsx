import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import CategorySelector from '../components/CategorySelector';
import ColorPicker from '../components/ColorPicker';
import { TaskFrequency } from '../types';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function CreateTaskScreen() {
  const navigation = useNavigation();
  const { addTask } = useStore();
  const theme = useTheme();

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [isRepeated, setIsRepeated] = useState(false);
  const [frequencyType, setFrequencyType] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'custom'>('once');
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>([]);
  const [customDays, setCustomDays] = useState('3');
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 0, label: t('daysOfWeek.sun') },
    { value: 1, label: t('daysOfWeek.mon') },
    { value: 2, label: t('daysOfWeek.tue') },
    { value: 3, label: t('daysOfWeek.wed') },
    { value: 4, label: t('daysOfWeek.thu') },
    { value: 5, label: t('daysOfWeek.fri') },
    { value: 6, label: t('daysOfWeek.sat') },
  ];

  const toggleDayOfWeek = (day: number) => {
    setSelectedDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const toggleDayOfMonth = (day: number) => {
    setSelectedDaysOfMonth(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      alert(t('errors.enterTaskName'));
      return;
    }


    if (isRepeated) {
      if (frequencyType === 'weekly' && selectedDaysOfWeek.length === 0) {
        alert(t('errors.selectWeekDay'));
        return;
      }
      if (frequencyType === 'monthly' && selectedDaysOfMonth.length === 0) {
        alert(t('errors.selectMonthDay'));
        return;
      }
      if (frequencyType === 'custom' && (!customDays || parseInt(customDays) < 1)) {
        alert(t('errors.enterValidDays'));
        return;
      }
    }

    setLoading(true);
    try {
      const frequency: TaskFrequency | undefined = isRepeated
        ? {
            type: frequencyType,
            daysOfWeek: frequencyType === 'weekly' ? selectedDaysOfWeek : undefined,
            daysOfMonth: frequencyType === 'monthly' ? selectedDaysOfMonth : undefined,
            customDays: frequencyType === 'custom' ? parseInt(customDays) : undefined,
          }
        : undefined;

      await addTask({
        taskName: taskName.trim(),
        description: description.trim(),
        categoryId,
        color,
        isCompleted: false,
        isRepeated,
        frequency,
        experienceReward: 10,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      alert(t('errors.createTaskFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{t('tasks.createTask')}</Text>

        <Input
          label={t('tasks.taskName')}
          value={taskName}
          onChangeText={setTaskName}
          placeholder={t('placeholders.enterTaskName')}
        />

        <Input
          label={t('tasks.description')}
          value={description}
          onChangeText={setDescription}
          placeholder={t('placeholders.enterTaskDescription')}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, { color: theme.text }]}>{t('labels.category')}</Text>

        <CategorySelector
          selectedCategoryId={categoryId}
          onSelectCategory={setCategoryId}
        />

        <ColorPicker
          selectedColor={color}
          onSelectColor={setColor}
          label={t('labels.taskColor')}
        />

        <TouchableOpacity
          style={styles.repeatToggle}
          onPress={() => setIsRepeated(!isRepeated)}
        >
          <View style={[styles.checkbox, { borderColor: theme.primary }, isRepeated && { backgroundColor: theme.primary }]}>
            {isRepeated && <View style={[styles.checkmark, { backgroundColor: theme.text }]} />}
          </View>
          <Text style={[styles.repeatText, { color: theme.text }]}>{t('tasks.repeated')}</Text>
        </TouchableOpacity>

        {isRepeated && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>{t('tasks.frequency')}</Text>
            <View style={styles.frequencyContainer}>
              {['daily', 'weekly', 'monthly', 'custom'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    frequencyType === freq && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                  ]}
                  onPress={() => setFrequencyType(freq as any)}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      { color: theme.textSecondary },
                      frequencyType === freq && { color: theme.primary },
                    ]}
                  >
                    {t(`tasks.frequencies.${freq}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {frequencyType === 'weekly' && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t('labels.selectDaysOfWeek')}</Text>
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day.value}
                      style={[
                        styles.dayOption,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        selectedDaysOfWeek.includes(day.value) && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                      ]}
                      onPress={() => toggleDayOfWeek(day.value)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          { color: theme.textSecondary },
                          selectedDaysOfWeek.includes(day.value) && { color: theme.primary },
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {frequencyType === 'monthly' && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t('labels.selectDaysOfMonth')}</Text>
                <View style={styles.daysContainer}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.monthDayOption,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        selectedDaysOfMonth.includes(day) && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                      ]}
                      onPress={() => toggleDayOfMonth(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          { color: theme.textSecondary },
                          selectedDaysOfMonth.includes(day) && { color: theme.primary },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {frequencyType === 'custom' && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t('labels.everyNDays')}</Text>
                <Input
                  value={customDays}
                  onChangeText={setCustomDays}
                  placeholder={t('placeholders.customDays')}
                  keyboardType="numeric"
                />
              </>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
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
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  repeatText: {
    fontSize: 16,
    fontWeight: '600',
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  frequencyOption: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  dayOption: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    minWidth: 48,
    alignItems: 'center',
  },
  monthDayOption: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    minWidth: 42,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
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
