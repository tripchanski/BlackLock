import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

export type FilterType = 'all' | 'active' | 'completed' | 'overdue' | 'today';

interface TaskFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { type: FilterType; icon: string; labelKey: string }[] = [
  { type: 'all', icon: 'list', labelKey: 'all' },
  { type: 'active', icon: 'play-circle', labelKey: 'active' },
  { type: 'completed', icon: 'checkmark-circle', labelKey: 'completed' },
  { type: 'overdue', icon: 'alert-circle', labelKey: 'overdue' },
  { type: 'today', icon: 'today', labelKey: 'today' },
];

const TaskFilter = React.memo(({ activeFilter, onFilterChange }: TaskFilterProps) => {
  const theme = useTheme();

  const getLabel = (labelKey: string) => {
    const labels: Record<string, string> = {
      all: t('labels.all') || 'All',
      active: t('labels.activeTasks') || 'Active',
      completed: t('labels.completed') || 'Completed',
      overdue: t('labels.overdue') || 'Overdue',
      today: t('labels.today') || 'Today',
    };
    return labels[labelKey] || labelKey;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.type;
        return (
          <TouchableOpacity
            key={filter.type}
            style={[
              styles.filterChip,
              { backgroundColor: theme.surface, borderColor: theme.border },
              isActive && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => onFilterChange(filter.type)}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={isActive ? '#fff' : theme.textSecondary}
            />
            <Text style={[
              styles.filterText,
              { color: isActive ? '#fff' : theme.text }
            ]}>
              {getLabel(filter.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

TaskFilter.displayName = 'TaskFilter';

export default TaskFilter;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    height: 44,
  },
  content: {
    gap: 8,
    paddingRight: 16,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
