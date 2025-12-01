import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  Keyboard,
} from 'react-native';
import { useStore } from '../services/store';
import { getWarningQuote, getReminderQuote } from '../constants/motivationalQuotes';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

interface TaskCompletionModalProps {
  visible: boolean;
  taskId: string;
  taskName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TaskCompletionModal({
  visible,
  taskId,
  taskName,
  onConfirm,
  onCancel,
}: TaskCompletionModalProps) {
  const theme = useTheme();
  const { settings } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [textInput, setTextInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const warningQuote = getWarningQuote(settings.language);
  const reminderQuote = getReminderQuote(settings.language);

  const expectedText = t('taskCompletion.confirmationText');

  const transitionToStep = (nextStep: 1 | 2 | 3 | 4) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      setError('');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleStep1Confirm = () => {
    transitionToStep(2);
  };

  const handleStep2Confirm = () => {
    transitionToStep(3);
  };

  const handleStep3Confirm = () => {
    if (textInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
      setError(t('taskCompletion.errorWrongText') || 'Incorrect text. Please try again.');
      return;
    }

    // Check if PIN is enabled
    if (settings.taskCompletionPin) {
      transitionToStep(4);
    } else {
      handleFinalConfirm();
    }
  };

  const handleStep4Confirm = () => {
    if (pinInput !== settings.taskCompletionPin) {
      setError(t('taskCompletion.errorWrongPin') || 'Incorrect PIN. Please try again.');
      setPinInput('');
      return;
    }
    handleFinalConfirm();
  };

  const handleFinalConfirm = () => {
    setStep(1);
    setTextInput('');
    setPinInput('');
    setError('');
    onConfirm();
  };

  const handleCancel = () => {
    setStep(1);
    setTextInput('');
    setPinInput('');
    setError('');
    fadeAnim.setValue(1);
    Keyboard.dismiss();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { opacity: fadeAnim, backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Step 1: Initial confirmation */}
          {step === 1 && (
            <>
              <Text style={[styles.title, { color: theme.text }]}>{warningQuote.text}</Text>
              <Text style={[styles.taskName, { color: theme.primary }]}>{taskName}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    {t('common.no') || 'No'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.primary }]}
                  onPress={handleStep1Confirm}
                >
                  <Text style={styles.buttonText}>
                    {t('common.yes') || 'Yes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 2: Motivational quote */}
          {step === 2 && (
            <>
              <Text style={[styles.title, { color: theme.text }]}>{reminderQuote.text}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {t('taskCompletion.confirmAgain') || 'Confirm once more that you really completed the task'}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    {t('common.cancel') || 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.success }]}
                  onPress={handleStep2Confirm}
                >
                  <Text style={styles.buttonText}>
                    {t('common.confirm') || 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 3: Text input confirmation */}
          {step === 3 && (
            <>
              <Text style={[styles.title, { color: theme.text }]}>
                {t('taskCompletion.typeToConfirm') || 'Type to confirm'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {t('taskCompletion.typePrompt') || 'Type the following text:'}
              </Text>
              <Text style={[styles.expectedText, { color: theme.primary }]}>
                {expectedText}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: error ? theme.error : theme.border,
                  },
                ]}
                value={textInput}
                onChangeText={(text) => {
                  setTextInput(text);
                  setError('');
                }}
                placeholder={expectedText}
                placeholderTextColor={theme.textTertiary}
                autoFocus
              />

              {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    {t('common.cancel') || 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.success }]}
                  onPress={handleStep3Confirm}
                >
                  <Text style={styles.buttonText}>
                    {t('common.confirm') || 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 4: PIN confirmation (optional) */}
          {step === 4 && (
            <>
              <Text style={[styles.title, { color: theme.text }]}>
                {t('taskCompletion.enterPin') || 'Enter PIN'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {t('taskCompletion.pinPrompt') || 'Enter your PIN to complete the task'}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: error ? theme.error : theme.border,
                  },
                ]}
                value={pinInput}
                onChangeText={(text) => {
                  setPinInput(text);
                  setError('');
                }}
                placeholder="****"
                placeholderTextColor={theme.textTertiary}
                secureTextEntry
                keyboardType="number-pad"
                maxLength={4}
                autoFocus
              />

              {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    {t('common.cancel') || 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.success }]}
                  onPress={handleStep4Confirm}
                >
                  <Text style={styles.buttonText}>
                    {t('common.confirm') || 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  taskName: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  expectedText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 158, 255, 0.1)',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
  },
  error: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
