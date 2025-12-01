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
      <View style={styles.colorsContainer}>
        {/* None/Clear option */}
        <TouchableOpacity
          style={[
            styles.colorOption,
            styles.noneOption,
            {
              backgroundColor: theme.surface,
              borderColor: !selectedColor ? theme.border : 'transparent',
            },
            !selectedColor && styles.colorSelected,
          ]}
          onPress={() => onSelectColor(undefined)}
        >
          {!selectedColor && (
            <Ionicons name="checkmark" size={16} color={theme.textSecondary} />
          )}
        </TouchableOpacity>

        {AVAILABLE_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
            onPress={() => onSelectColor(color)}
          >
            {selectedColor === color && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  noneOption: {
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});
