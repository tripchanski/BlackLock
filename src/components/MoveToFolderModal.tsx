import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

interface MoveToFolderModalProps {
  visible: boolean;
  taskId: string;
  currentFolderId?: string;
  onClose: () => void;
}

export default function MoveToFolderModal({ visible, taskId, currentFolderId, onClose }: MoveToFolderModalProps) {
  const theme = useTheme();
  const { folders, updateTask } = useStore();

  const handleMoveToFolder = async (folderId: string | undefined) => {
    await updateTask(taskId, { folderId });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t('labels.moveToFolder') || 'Move to Folder'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            {/* No folder option */}
            <TouchableOpacity
              style={[
                styles.folderItem,
                { borderBottomColor: theme.border },
                !currentFolderId && { backgroundColor: theme.primaryLight }
              ]}
              onPress={() => handleMoveToFolder(undefined)}
            >
              <View style={[styles.folderIcon, { backgroundColor: theme.surface }]}>
                <Ionicons name="folder-outline" size={24} color={theme.textSecondary} />
              </View>
              <Text style={[styles.folderName, { color: theme.text }]}>
                {t('labels.noFolder') || 'No Folder'}
              </Text>
              {!currentFolderId && (
                <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>

            {/* Folders */}
            {folders.filter(f => !f.parentFolderId).map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={[
                  styles.folderItem,
                  { borderBottomColor: theme.border },
                  currentFolderId === folder.id && { backgroundColor: theme.primaryLight }
                ]}
                onPress={() => handleMoveToFolder(folder.id)}
              >
                <View style={[styles.folderIcon, { backgroundColor: folder.color + '20' }]}>
                  <Ionicons name={folder.icon as any} size={24} color={folder.color} />
                </View>
                <Text style={[styles.folderName, { color: theme.text }]}>
                  {folder.name}
                </Text>
                {currentFolderId === folder.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
