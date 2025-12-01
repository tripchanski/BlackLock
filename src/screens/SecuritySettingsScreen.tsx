import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

export default function SecuritySettingsScreen() {
  const { settings, setSettings } = useStore();
  const theme = useTheme();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  const handleSetPin = () => {
    if (pinInput.length !== 4) {
      Alert.alert(t('labels.error'), t('errors.pinMust4Digits'));
      return;
    }
    if (pinInput !== confirmPinInput) {
      Alert.alert(t('labels.error'), t('errors.pinsNotMatch'));
      return;
    }
    setSettings({ taskCompletionPin: pinInput });
    setPinInput('');
    setConfirmPinInput('');
    setShowPinModal(false);
    Alert.alert(t('labels.success'), t('errors.pinSetSuccess'));
  };

  const handleRemovePin = () => {
    Alert.alert(
      t('labels.removePin'),
      t('labels.removePinConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('labels.remove'),
          style: 'destructive',
          onPress: () => setSettings({ taskCompletionPin: undefined }),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('settings.taskCompletionPin')}</Text>
      <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
        {t('settings.setPinDescription')}
      </Text>

      <View style={styles.pinSection}>
        {settings.taskCompletionPin ? (
          <View style={styles.pinRow}>
            <Text style={[styles.pinStatus, { color: theme.success }]}>
              ✓ {t('labels.enabled')}
            </Text>
            <View style={styles.pinButtons}>
              <TouchableOpacity
                style={[styles.pinButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowPinModal(true)}
              >
                <Text style={styles.pinButtonText}>{t('labels.change')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pinButton, { backgroundColor: theme.error }]}
                onPress={handleRemovePin}
              >
                <Text style={styles.pinButtonText}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.setPinButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => setShowPinModal(true)}
          >
            <Text style={[styles.setPinText, { color: theme.text }]}>{t('settings.taskCompletionPin')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowPinModal(false);
          setPinInput('');
          setConfirmPinInput('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {settings.taskCompletionPin ? 'Change PIN' : 'Set PIN'}
            </Text>
            <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>
              Enter a 4-digit PIN for task completion confirmation
            </Text>

            <TextInput
              style={[
                styles.pinInputField,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={pinInput}
              onChangeText={setPinInput}
              placeholder={t('placeholders.enterPin')}
              placeholderTextColor={theme.textTertiary}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              autoFocus
            />

            <TextInput
              style={[
                styles.pinInputField,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={confirmPinInput}
              onChangeText={setConfirmPinInput}
              placeholder={t('placeholders.confirmPin')}
              placeholderTextColor={theme.textTertiary}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setConfirmPinInput('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.success }]}
                onPress={handleSetPin}
              >
                <Text style={styles.modalButtonText}>
                  {t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  pinSection: {
    marginBottom: 12,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  pinButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  setPinButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  setPinText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  pinInputField: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
