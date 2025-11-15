import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVAILABLE_COLORS } from '../constants/categories';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

interface ColorPickerProps {
  selectedColor?: string;
  onSelectColor: (color: string | undefined) => void;
  label?: string;
}

export default function ColorPicker({ selectedColor, onSelectColor, label }: ColorPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.colorsContainer}>
          {/* None/Clear option */}
          <TouchableOpacity
            style={[
              styles.colorOption,
              styles.noneOption,
              {
                backgroundColor: theme.surface,
                borderColor: !selectedColor ? theme.text : theme.border,
              },
            ]}
            onPress={() => onSelectColor(undefined)}
          >
            {!selectedColor && (
              <Ionicons name="checkmark" size={20} color={theme.textSecondary} />
            )}
          </TouchableOpacity>

          {AVAILABLE_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && { borderColor: theme.text, borderStyle: 'solid' },
              ]}
              onPress={() => onSelectColor(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  scroll: {
    marginHorizontal: -4,
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  noneOption: {
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  colorOptionSelected: {
    // Border color applied inline with theme
  },
});
