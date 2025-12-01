import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

interface NotificationPickerProps {
  label: string;
  value: number[]; // minutes before deadline
  onChange: (minutes: number[]) => void;
  disabled?: boolean;
}

const PRESET_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '6 hours', value: 360 },
  { label: '12 hours', value: 720 },
  { label: '1 day', value: 1440 },
  { label: '2 days', value: 2880 },
  { label: '1 week', value: 10080 },
];

export default function NotificationPicker({ label, value, onChange, disabled }: NotificationPickerProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  const toggleOption = (minutes: number) => {
    if (value.includes(minutes)) {
      onChange(value.filter(v => v !== minutes));
    } else {
      onChange([...value, minutes].sort((a, b) => a - b));
    }
  };

  const addCustom = () => {
    const mins = parseInt(customMinutes);
    if (mins > 0 && !value.includes(mins)) {
      onChange([...value, mins].sort((a, b) => a - b));
      setCustomMinutes('');
    }
  };

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins} ${t('labels.minutes') || 'min'}`;
    if (mins < 1440) return `${Math.floor(mins / 60)} ${t('labels.hours') || 'h'}`;
    return `${Math.floor(mins / 1440)} ${t('labels.days') || 'd'}`;
  };

  const getPresetLabel = (mins: number) => {
    if (mins === 15) return `15 ${t('labels.minutes') || 'min'}`;
    if (mins === 30) return `30 ${t('labels.minutes') || 'min'}`;
    if (mins === 60) return `1 ${t('labels.hour') || 'hour'}`;
    if (mins === 120) return `2 ${t('labels.hours') || 'hours'}`;
    if (mins === 180) return `3 ${t('labels.hours') || 'hours'}`;
    if (mins === 360) return `6 ${t('labels.hours') || 'hours'}`;
    if (mins === 720) return `12 ${t('labels.hours') || 'hours'}`;
    if (mins === 1440) return `1 ${t('labels.day') || 'day'}`;
    if (mins === 2880) return `2 ${t('labels.days') || 'days'}`;
    if (mins === 10080) return `1 ${t('labels.week') || 'week'}`;
    return formatMinutes(mins);
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Ionicons name="notifications-outline" size={20} color={disabled ? theme.textSecondary : theme.primary} />
        <Text style={[styles.selectorText, { color: disabled ? theme.textSecondary : theme.text }]} numberOfLines={1}>
          {value.length === 0
            ? (t('labels.noReminders') || 'No reminders')
            : value.map(v => formatMinutes(v)).join(', ')
          }
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {t('labels.remindMe') || 'Remind me'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsGrid}>
              {PRESET_OPTIONS.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border,
                      }
                    ]}
                    onPress={() => toggleOption(option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: isSelected ? '#fff' : theme.text }
                    ]}>
                      {getPresetLabel(option.value)}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#fff" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.customSection}>
              <Text style={[styles.customLabel, { color: theme.text }]}>
                {t('labels.customMinutes') || 'Custom (minutes)'}:
              </Text>
              <View style={styles.customRow}>
                <TextInput
                  style={[styles.customInput, {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    color: theme.text
                  }]}
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor={theme.textSecondary}
                />
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.primary }]}
                  onPress={addCustom}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {value.length > 0 && (
              <View style={styles.selectedSection}>
                <Text style={[styles.selectedLabel, { color: theme.textSecondary }]}>
                  {t('labels.selected') || 'Selected'}:
                </Text>
                <View style={styles.selectedChips}>
                  {value.map(mins => (
                    <View
                      key={mins}
                      style={[styles.selectedChip, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                    >
                      <Text style={[styles.selectedChipText, { color: theme.text }]}>
                        {formatMinutes(mins)}
                      </Text>
                      <TouchableOpacity onPress={() => toggleOption(mins)}>
                        <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>{t('common.save') || 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectorText: {
    flex: 1,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 4,
  },
  customSection: {
    marginBottom: 20,
  },
  customLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSection: {
    marginBottom: 20,
  },
  selectedLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  doneButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
