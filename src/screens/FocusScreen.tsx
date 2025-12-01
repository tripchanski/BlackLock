import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Vibration,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useStore } from '../services/store';
import { t } from '../services/i18n';
import { PomodoroPhase, PomodoroSettings } from '../types';
import CircularTimer from '../components/CircularTimer';
import { getRandomQuote } from '../constants/motivationalQuotes';

export default function FocusScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { tasks, settings, setSettings } = useStore();
  const pomodoroSettings = settings.pomodoroSettings;
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [timeRemaining, setTimeRemaining] = useState(pomodoroSettings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalMinutesFocused, setTotalMinutesFocused] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettings>(pomodoroSettings);
  const [motivationalQuote, setMotivationalQuote] = useState(getRandomQuote(settings.language, 'encouragement'));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMinuteRef = useRef<number>(Math.floor(timeRemaining / 60));

  const incompleteTasks = tasks.filter(task => !task.isCompleted);

  const handleSaveSettings = async () => {
    await setSettings({ pomodoroSettings: tempSettings });
    setShowSettingsModal(false);
    setPhase('work');
    setTimeRemaining(tempSettings.workDuration * 60);
    setIsRunning(false);
  };

  const getPhaseConfig = () => {
    switch (phase) {
      case 'work':
        return {
          duration: pomodoroSettings.workDuration * 60,
          color: theme.primary,
          label: t('focus.workPhase') || 'Work Time',
          emoji: '💪',
        };
      case 'shortBreak':
        return {
          duration: pomodoroSettings.shortBreakDuration * 60,
          color: theme.success,
          label: t('focus.shortBreak') || 'Short Break',
          emoji: '☕',
        };
      case 'longBreak':
        return {
          duration: pomodoroSettings.longBreakDuration * 60,
          color: theme.warning,
          label: t('focus.longBreak') || 'Long Break',
          emoji: '🌟',
        };
    }
  };

  const config = getPhaseConfig();

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    const currentMinute = Math.floor(timeRemaining / 60);
    if (currentMinute !== lastMinuteRef.current && isRunning) {
      lastMinuteRef.current = currentMinute;
      setMotivationalQuote(getRandomQuote(settings.language, 'encouragement'));
    }
  }, [timeRemaining, isRunning, settings.language]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    Vibration.vibrate([0, 500, 200, 500]);

    if (phase === 'work') {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      setTotalMinutesFocused((prev) => prev + pomodoroSettings.workDuration);

      const nextPhase =
        newSessionCount % pomodoroSettings.sessionsBeforeLongBreak === 0
          ? 'longBreak'
          : 'shortBreak';
      setPhase(nextPhase);
      setTimeRemaining(
        nextPhase === 'longBreak'
          ? pomodoroSettings.longBreakDuration * 60
          : pomodoroSettings.shortBreakDuration * 60
      );

      if (pomodoroSettings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      setPhase('work');
      setTimeRemaining(pomodoroSettings.workDuration * 60);

      if (pomodoroSettings.autoStartWork) {
        setIsRunning(true);
      }
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    Alert.alert(
      t('focus.confirmReset') || 'Reset Timer?',
      t('focus.resetMessage') || 'Are you sure you want to reset? Your progress will be lost.',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('focus.reset') || 'Reset',
          style: 'destructive',
          onPress: () => {
            setIsRunning(false);
            setTimeRemaining(config.duration);
          },
        },
      ]
    );
  };

  const progress = 1 - timeRemaining / config.duration;

  const selectedTaskObj = selectedTask
    ? tasks.find((t) => t.id === selectedTask)
    : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('focus.title') || 'Focus Mode'}
          </Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Ionicons name="help-circle-outline" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>

      {/* Phase indicator */}
      <View style={styles.phaseContainer}>
        <Text style={[styles.phaseEmoji]}>{config.emoji}</Text>
        <Text style={[styles.phaseLabel, { color: theme.textSecondary }]}>
          {config.label}
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <CircularTimer
          size={280}
          strokeWidth={16}
          progress={progress}
          timeRemaining={timeRemaining}
          color={config.color}
          backgroundColor={theme.border}
          textColor={theme.text}
        />
      </View>

      {/* Motivational Quote */}
      {isRunning && (
        <View style={styles.quoteContainer}>
          <Text style={[styles.quoteText, { color: theme.primary }]}>
            {motivationalQuote.text}
          </Text>
        </View>
      )}

      {/* Selected Task */}
      <TouchableOpacity
        style={[
          styles.taskSelector,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        onPress={() => setShowTaskModal(true)}
      >
        <Text style={[styles.taskLabel, { color: theme.textSecondary }]}>
          {t('focus.focusOn') || 'Focusing on'}:
        </Text>
        <Text style={[styles.taskName, { color: theme.text }]}>
          {selectedTaskObj?.taskName || (t('focus.noTask') || 'No task selected')}
        </Text>
      </TouchableOpacity>

      {/* Session counter */}
      <View style={styles.sessionCounter}>
        <Text style={[styles.sessionLabel, { color: theme.textSecondary }]}>
          {t('focus.sessions') || 'Sessions'}:
        </Text>
        <View style={styles.tomatoContainer}>
          {Array.from({ length: pomodoroSettings.sessionsBeforeLongBreak }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.sessionDot,
                {
                  backgroundColor: i < sessionsCompleted % pomodoroSettings.sessionsBeforeLongBreak
                    ? theme.primary
                    : theme.border
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Focus and Settings Buttons Row */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[
            styles.focusButton,
            { backgroundColor: theme.primary },
          ]}
          onPress={handleStartPause}
        >
          <Text style={styles.focusButtonText}>
            {isRunning ? (t('focus.pause') || 'Pause') : (t('focus.start') || 'Start')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => {
            setTempSettings(pomodoroSettings);
            setShowSettingsModal(true);
          }}
        >
          <Ionicons name="settings" size={20} color={theme.primary} />
          <Text style={[styles.settingsButtonText, { color: theme.text }]}>
            {t('settings.title') || 'Settings'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reset Button */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={handleReset}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            {t('focus.reset') || 'Reset'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={[styles.statsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>
          {t('focus.todayStats') || "Today's Stats"}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {sessionsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('focus.completed') || 'Completed'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.success }]}>
              {totalMinutesFocused}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('focus.minutes') || 'Minutes'}
            </Text>
          </View>
        </View>
      </View>

      {/* Task Selection Modal */}
      <Modal
        visible={showTaskModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t('focus.selectTask') || 'Select Task'}
            </Text>

            <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.taskItem,
                  { borderColor: theme.border },
                  !selectedTask && { backgroundColor: theme.primaryLight + '20' },
                ]}
                onPress={() => {
                  setSelectedTask(null);
                  setShowTaskModal(false);
                }}
              >
                <Text style={[styles.taskItemText, { color: theme.textSecondary }]}>
                  {t('focus.noTask') || 'No task selected'}
                </Text>
              </TouchableOpacity>

              {incompleteTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskItem,
                    { borderColor: theme.border },
                    selectedTask === task.id && { backgroundColor: theme.primaryLight + '20' },
                  ]}
                  onPress={() => {
                    setSelectedTask(task.id);
                    setShowTaskModal(false);
                  }}
                >
                  <Text style={[styles.taskItemText, { color: theme.text }]}>
                    {task.taskName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.border }]}
              onPress={() => setShowTaskModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.text }]}>
                {t('common.close') || 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettingsModal(false)}
        >
          <TouchableOpacity
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('focus.pomodoroSettings')}</Text>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('focus.workDuration')} ({t('labels.minutes')})</Text>
              <TextInput
                style={[styles.settingInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                value={String(tempSettings.workDuration)}
                onChangeText={(text) => setTempSettings({...tempSettings, workDuration: parseInt(text) || 1})}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('focus.shortBreakDuration')} ({t('labels.minutes')})</Text>
              <TextInput
                style={[styles.settingInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                value={String(tempSettings.shortBreakDuration)}
                onChangeText={(text) => setTempSettings({...tempSettings, shortBreakDuration: parseInt(text) || 1})}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('focus.longBreakDuration')} ({t('labels.minutes')})</Text>
              <TextInput
                style={[styles.settingInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                value={String(tempSettings.longBreakDuration)}
                onChangeText={(text) => setTempSettings({...tempSettings, longBreakDuration: parseInt(text) || 1})}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('focus.sessionsBeforeLongBreak')} ({t('labels.sessions')})</Text>
              <TextInput
                style={[styles.settingInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                value={String(tempSettings.sessionsBeforeLongBreak)}
                onChangeText={(text) => setTempSettings({...tempSettings, sessionsBeforeLongBreak: parseInt(text) || 1})}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('focus.autoStartBreaks')}</Text>
              <Switch
                value={tempSettings.autoStartBreaks}
                onValueChange={(value) => setTempSettings({...tempSettings, autoStartBreaks: value})}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t('focus.autoStartWork')}</Text>
              <Switch
                value={tempSettings.autoStartWork}
                onValueChange={(value) => setTempSettings({...tempSettings, autoStartWork: value})}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.success }]}
                onPress={handleSaveSettings}
              >
                <Text style={styles.modalButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.infoModalHeader}>
              <Ionicons name="information-circle" size={48} color={theme.primary} />
              <Text style={[styles.modalTitle, { color: theme.text, marginTop: 16 }]}>
                {t('focus.whatIsFocusMode') || 'What is Focus Mode?'}
              </Text>
            </View>

            <ScrollView style={styles.infoContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.infoText, { color: theme.text }]}>
                {t('focus.infoDescription') || 'Focus Mode helps you concentrate on your tasks using timed work sessions and breaks.'}
              </Text>

              <View style={styles.infoSection}>
                <Text style={[styles.infoSectionTitle, { color: theme.primary }]}>
                  {t('focus.howItWorks') || 'How it works:'}
                </Text>
                <Text style={[styles.infoText, { color: theme.text }]}>
                  • {t('focus.info1') || 'Select a task to focus on'}
                </Text>
                <Text style={[styles.infoText, { color: theme.text }]}>
                  • {t('focus.info2') || 'Work for a set period (default 25 minutes)'}
                </Text>
                <Text style={[styles.infoText, { color: theme.text }]}>
                  • {t('focus.info3') || 'Take short breaks between sessions'}
                </Text>
                <Text style={[styles.infoText, { color: theme.text }]}>
                  • {t('focus.info4') || 'After several sessions, take a longer break'}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={[styles.infoSectionTitle, { color: theme.primary }]}>
                  {t('focus.whyItWorks') || 'Why it works:'}
                </Text>
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {t('focus.benefitsDescription') || 'Regular breaks prevent burnout and keep your mind fresh. Timed sessions create urgency and help you stay focused on one task at a time.'}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalCloseText}>
                {t('common.gotIt') || 'Got it!'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
    position: 'relative',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  infoButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  pomodoroSettingsButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
    gap: 8,
  },
  pomodoroSettingsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phaseEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  timerContainer: {
    marginBottom: 24,
  },
  quoteContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
  taskSelector: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
    alignItems: 'center',
  },
  taskLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
  },
  sessionCounter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sessionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  tomatoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  focusButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  focusButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  taskList: {
    maxHeight: 300,
  },
  taskItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  taskItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  settingInput: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  infoContent: {
    maxHeight: 400,
    marginBottom: 24,
  },
  infoSection: {
    marginTop: 16,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});
