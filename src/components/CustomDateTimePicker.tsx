import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

interface CustomDateTimePickerProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
}

const CustomDateTimePicker = React.memo(({
  visible,
  mode,
  value,
  onConfirm,
  onCancel,
  minimumDate,
}: CustomDateTimePickerProps) => {
  const theme = useTheme();
  const [tempDate, setTempDate] = useState(value);

  const handleConfirm = () => {
    onConfirm(tempDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (Platform.OS === 'ios') {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onCancel}
      >
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: theme.surface }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {mode === 'date' ? t('placeholders.selectDate') : t('placeholders.selectTime')}
            </Text>

            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) setTempDate(selectedDate);
              }}
              minimumDate={minimumDate}
              textColor={theme.text}
              style={styles.picker}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
                onPress={onCancel}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: theme.primary }]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  {t('common.confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Android uses native picker
  if (!visible) return null;

  return (
    <DateTimePicker
      value={tempDate}
      mode={mode}
      display="default"
      onChange={(event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          onConfirm(selectedDate);
        } else {
          onCancel();
        }
      }}
      minimumDate={minimumDate}
    />
  );
});

CustomDateTimePicker.displayName = 'CustomDateTimePicker';

export default CustomDateTimePicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    height: 200,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
  },
});
