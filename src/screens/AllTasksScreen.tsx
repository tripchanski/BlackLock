import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import Card from '../components/Card';
import TaskCompletionModal from '../components/TaskCompletionModal';
import MoveToFolderModal from '../components/MoveToFolderModal';
import CreateFolderModal from '../components/CreateFolderModal';
import SearchBar from '../components/SearchBar';
import TaskFilter, { FilterType } from '../components/TaskFilter';
import { Task, Folder } from '../types';
import { t } from '../services/i18n';

export default function AllTasksScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { tasks, completeTask, categories, folders, updateTask, settings } = useStore();
  const folderView = settings.folderView || 'list';
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [taskToMove, setTaskToMove] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [createFolderVisible, setCreateFolderVisible] = useState(false);
  // Current folder navigation (null = root view)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null;

  const formatDeadline = useCallback((deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });

    if (diffMs < 0) {
      return { text: `${dateStr} ${timeStr}`, color: theme.error, isOverdue: true };
    } else if (diffHours < 24) {
      return { text: `${t('labels.today') || 'Today'} ${timeStr}`, color: theme.warning, isOverdue: false };
    } else if (diffDays === 1) {
      return { text: `${t('labels.tomorrow') || 'Tomorrow'} ${timeStr}`, color: theme.primary, isOverdue: false };
    } else {
      return { text: `${dateStr} ${timeStr}`, color: theme.textSecondary, isOverdue: false };
    }
  }, [theme]);

  // Filter tasks based on search, filter, and current folder
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply folder filter
    if (currentFolderId) {
      result = result.filter(task => task.folderId === currentFolderId);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.taskName.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (activeFilter) {
      case 'active':
        result = result.filter(task => !task.isCompleted);
        break;
      case 'completed':
        result = result.filter(task => task.isCompleted);
        break;
      case 'overdue':
        result = result.filter(task => {
          if (!task.deadline || task.isCompleted) return false;
          return new Date(task.deadline) < new Date();
        });
        break;
      case 'today':
        result = result.filter(task => {
          if (!task.deadline || task.isCompleted) return false;
          const deadlineDate = new Date(task.deadline);
          const today = new Date();
          return deadlineDate.toDateString() === today.toDateString();
        });
        break;
      default:
        // 'all' - show all non-completed by default
        result = result.filter(task => !task.isCompleted);
    }

    return result;
  }, [tasks, searchQuery, activeFilter, currentFolderId]);

  // Get tasks without folder (only for root view)
  const tasksWithoutFolder = useMemo(() => {
    if (currentFolderId) return [];
    return filteredTasks.filter(task => !task.folderId);
  }, [filteredTasks, currentFolderId]);

  // Get visible folders (only in root view)
  const visibleFolders = useMemo(() => {
    if (currentFolderId) return [];
    return folders.filter(f => !f.parentFolderId).sort((a, b) => a.order - b.order);
  }, [folders, currentFolderId]);

  const enterFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const goBack = () => {
    setCurrentFolderId(null);
  };

  const handleTaskPress = useCallback((taskId: string) => {
    // @ts-ignore
    navigation.navigate('TaskDetail', { taskId });
  }, [navigation]);

  const handleCompletePress = useCallback((task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  }, []);

  const handleConfirmComplete = useCallback(async () => {
    if (selectedTask) {
      await completeTask(selectedTask.id);
      setModalVisible(false);
      setSelectedTask(null);
    }
  }, [selectedTask, completeTask]);

  const handleCancelComplete = useCallback(() => {
    setModalVisible(false);
    setSelectedTask(null);
  }, []);

  const renderTask = ({ item }: { item: Task }) => {
    const category = item.categoryId
      ? categories.find(c => c.id === item.categoryId)
      : null;

    const folder = item.folderId
      ? folders.find(f => f.id === item.folderId)
      : null;

    const taskColor = item.color || category?.color;
    const showColorIndicator = taskColor && taskColor !== category?.color;

    return (
      <Card onPress={() => handleTaskPress(item.id)} style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <View style={styles.taskNameRow}>
              {category && (
                <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={14} color="#fff" />
                </View>
              )}
              {showColorIndicator && (
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              )}
              <Text style={[styles.taskName, { color: theme.text }]} numberOfLines={1}>
                {item.taskName}
              </Text>
            </View>
            <Text style={styles.taskXP}>+{item.experienceReward} XP</Text>
          </View>
          <View style={styles.taskActions}>
            <TouchableOpacity
              style={styles.moveButton}
              onPress={(e) => {
                e.stopPropagation();
                setTaskToMove(item);
                setMoveModalVisible(true);
              }}
            >
              <Ionicons name="folder-open-outline" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            {!item.isCompleted && (
              <TouchableOpacity
                style={styles.checkButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCompletePress(item);
                }}
              >
                <View style={[styles.checkbox, { borderColor: theme.primary }]} />
              </TouchableOpacity>
            )}
            {item.isCompleted && (
              <View style={styles.checkButton}>
                <Ionicons name="checkmark-circle" size={24} color={theme.success} />
              </View>
            )}
          </View>
        </View>
        {item.description && (
          <Text style={[styles.taskDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.taskFooter}>
          {item.deadline && (() => {
            const deadlineInfo = formatDeadline(item.deadline);
            return (
              <Text style={[styles.deadlineTag, { color: deadlineInfo.color }]}>
                {deadlineInfo.isOverdue ? '⚠️ ' : '📅 '}{deadlineInfo.text}
              </Text>
            );
          })()}
          {item.isRepeated && (
            <Text style={[styles.repeatedTag, { color: theme.textSecondary }]}>
              🔁 {t(`tasks.frequencies.${item.frequency?.type}`)}
            </Text>
          )}
          {category && (
            <Text style={[styles.categoryTag, { color: taskColor || category.color }]}>
              {category.isDefault ? t(`categories.${category.name.toLowerCase()}`) : category.name}
            </Text>
          )}
        </View>
      </Card>
    );
  };

  // Render folder item (list or grid)
  const renderFolderItem = (folder: Folder) => {
    const folderTaskCount = tasks.filter(t => t.folderId === folder.id && !t.isCompleted).length;

    if (folderView === 'grid') {
      return (
        <TouchableOpacity
          key={folder.id}
          style={[styles.folderGridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => enterFolder(folder.id)}
        >
          <View style={[styles.folderGridIcon, { backgroundColor: folder.color + '20' }]}>
            <Ionicons name={folder.icon as any} size={28} color={folder.color} />
          </View>
          <Text style={[styles.folderGridName, { color: theme.text }]} numberOfLines={1}>
            {folder.name}
          </Text>
          <Text style={[styles.folderGridCount, { color: theme.textSecondary }]}>
            {folderTaskCount} {folderTaskCount === 1 ? t('labels.task') : t('labels.tasks')}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={folder.id}
        style={[styles.folderListItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => enterFolder(folder.id)}
      >
        <View style={[styles.folderIcon, { backgroundColor: folder.color + '20' }]}>
          <Ionicons name={folder.icon as any} size={20} color={folder.color} />
        </View>
        <View style={styles.folderListInfo}>
          <Text style={[styles.folderListName, { color: theme.text }]}>{folder.name}</Text>
          <Text style={[styles.folderListCount, { color: theme.textSecondary }]}>
            {folderTaskCount} {folderTaskCount === 1 ? t('labels.task') : t('labels.tasks')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    );
  };

  const totalTasks = filteredTasks.length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          {currentFolder ? (
            // Inside folder - show back button and folder name
            <View style={styles.folderHeader}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </TouchableOpacity>
              <View style={[styles.currentFolderIcon, { backgroundColor: currentFolder.color + '20' }]}>
                <Ionicons name={currentFolder.icon as any} size={20} color={currentFolder.color} />
              </View>
              <View style={styles.folderHeaderText}>
                <Text style={[styles.title, { color: theme.text }]}>{currentFolder.name}</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {totalTasks} {totalTasks === 1 ? t('labels.task') : t('labels.tasks')}
                </Text>
              </View>
            </View>
          ) : (
            // Root view
            <>
              <Text style={[styles.title, { color: theme.text }]}>{t('tasks.allTasks')}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {totalTasks} {totalTasks === 1 ? t('labels.task') : t('labels.tasks')}
              </Text>
            </>
          )}
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('placeholders.searchTasks') || 'Search tasks...'}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterToggle, { backgroundColor: showFilters ? theme.primary : theme.surface, borderColor: theme.border }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={showFilters ? '#fff' : theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {showFilters && (
            <TaskFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          )}
        </View>

        {totalTasks === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {searchQuery || activeFilter !== 'all'
                ? (t('labels.noTasksFound') || 'No tasks found')
                : (t('tasks.noTasks') || 'No tasks yet')
              }
            </Text>
            {!searchQuery && activeFilter === 'all' && (
              <>
                <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
                  {t('labels.createFirstTask')}
                </Text>
                <TouchableOpacity
                  style={[styles.centeredButton, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('CreateTask');
                  }}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                  <Text style={styles.centeredButtonText}>{t('labels.createTask')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <>
            <SectionList
              sections={[]}
              renderItem={() => null}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  {/* Root view: folders + tasks without folder */}
                  {!currentFolderId && (
                    <>
                      {/* Folders */}
                      {visibleFolders.length > 0 && (
                        <View style={folderView === 'grid' ? styles.folderGrid : styles.folderList}>
                          {visibleFolders.map(folder => renderFolderItem(folder))}
                        </View>
                      )}
                      {/* Tasks without folder */}
                      {tasksWithoutFolder.map(task => (
                        <View key={task.id}>
                          {renderTask({ item: task })}
                        </View>
                      ))}
                    </>
                  )}
                  {/* Inside folder: just tasks */}
                  {currentFolderId && (
                    <>
                      {filteredTasks.map(task => (
                        <View key={task.id}>
                          {renderTask({ item: task })}
                        </View>
                      ))}
                    </>
                  )}
                </>
              }
            />

            {/* FAB Menu */}
            {showFabMenu && (
              <View style={styles.fabMenu}>
                <TouchableOpacity
                  style={[styles.fabMenuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => {
                    setShowFabMenu(false);
                    // @ts-ignore
                    navigation.navigate('CreateTask');
                  }}
                >
                  <Ionicons name="checkbox-outline" size={20} color={theme.primary} />
                  <Text style={[styles.fabMenuText, { color: theme.text }]}>{t('labels.createTask')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fabMenuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => {
                    setShowFabMenu(false);
                    setCreateFolderVisible(true);
                  }}
                >
                  <Ionicons name="folder-outline" size={20} color={theme.primary} />
                  <Text style={[styles.fabMenuText, { color: theme.text }]}>{t('labels.createFolder')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* FAB - Floating Action Button */}
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: theme.primary }]}
              onPress={() => setShowFabMenu(!showFabMenu)}
            >
              <Ionicons name={showFabMenu ? "close" : "add"} size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        <TaskCompletionModal
          visible={modalVisible}
          taskId={selectedTask?.id || ''}
          taskName={selectedTask?.taskName || ''}
          onConfirm={handleConfirmComplete}
          onCancel={handleCancelComplete}
        />

        <MoveToFolderModal
          visible={moveModalVisible}
          taskId={taskToMove?.id || ''}
          currentFolderId={taskToMove?.folderId}
          onClose={() => {
            setMoveModalVisible(false);
            setTaskToMove(null);
          }}
        />

        <CreateFolderModal
          visible={createFolderVisible}
          onClose={() => setCreateFolderVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 16,
    marginBottom: 20,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  currentFolderIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  folderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
  },
  taskNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  taskXP: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  deadlineTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  repeatedTag: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moveButton: {
    padding: 8,
  },
  checkButton: {
    padding: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  centeredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  centeredButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
  },
  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    height: 56,
    justifyContent: 'flex-start',
  },
  fabMenu: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 170,
    gap: 10,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabMenuText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  noFolderTasks: {
    marginBottom: 16,
  },
  folderList: {
    marginBottom: 16,
    gap: 8,
  },
  folderListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  folderListInfo: {
    flex: 1,
  },
  folderListName: {
    fontSize: 16,
    fontWeight: '600',
  },
  folderListCount: {
    fontSize: 13,
    marginTop: 2,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  folderGridItem: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  folderGridIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  folderGridName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  folderGridCount: {
    fontSize: 12,
  },
  gridExpandedFolder: {
    marginBottom: 16,
  },
  gridFolderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  gridFolderTitleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
