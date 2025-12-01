import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';
import { Folder } from '../types';

interface FolderSelectorProps {
  selectedFolderId?: string;
  onSelectFolder: (folderId: string | undefined) => void;
  parentFolderId?: string; // For nested folder selection
}

const FOLDER_ICONS = [
  'folder', 'folder-open', 'briefcase', 'school', 'home', 'heart',
  'star', 'bookmark', 'flag', 'trophy', 'gift', 'cart',
  'fitness', 'musical-notes', 'camera', 'airplane', 'car', 'restaurant',
  'medkit', 'book', 'laptop', 'desktop', 'phone-portrait', 'code-slash',
];

const FOLDER_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
];

export default function FolderSelector({ selectedFolderId, onSelectFolder, parentFolderId }: FolderSelectorProps) {
  const theme = useTheme();
  const { folders, addFolder, updateFolder, deleteFolder } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('folder');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');

  // Filter folders based on parentFolderId
  const availableFolders = parentFolderId !== undefined
    ? folders.filter(f => f.parentFolderId === parentFolderId)
    : folders.filter(f => !f.parentFolderId);

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    await addFolder({
      name: newFolderName.trim(),
      icon: newFolderIcon,
      color: newFolderColor,
      parentFolderId: parentFolderId,
      order: folders.length,
    });

    setNewFolderName('');
    setNewFolderIcon('folder');
    setNewFolderColor('#6366f1');
    setCreateModalVisible(false);
  };

  const handleEditFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) return;

    await updateFolder(editingFolder.id, {
      name: newFolderName.trim(),
      icon: newFolderIcon,
      color: newFolderColor,
    });

    setEditingFolder(null);
    setNewFolderName('');
    setNewFolderIcon('folder');
    setNewFolderColor('#6366f1');
    setCreateModalVisible(false);
  };

  const handleDeleteFolder = async (folderId: string) => {
    await deleteFolder(folderId);
    if (selectedFolderId === folderId) {
      onSelectFolder(undefined);
    }
  };

  const openEditModal = (folder: Folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderIcon(folder.icon);
    setNewFolderColor(folder.color);
    setCreateModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingFolder(null);
    setNewFolderName('');
    setNewFolderIcon('folder');
    setNewFolderColor('#6366f1');
    setCreateModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{t('labels.folder') || 'Folder'}</Text>

      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => setModalVisible(true)}
      >
        {selectedFolder ? (
          <>
            <Ionicons name={selectedFolder.icon as any} size={20} color={selectedFolder.color} />
            <Text style={[styles.selectorText, { color: theme.text }]}>{selectedFolder.name}</Text>
          </>
        ) : (
          <>
            <Ionicons name="folder-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.selectorText, { color: theme.textSecondary }]}>
              {t('labels.noFolder') || 'No folder'}
            </Text>
          </>
        )}
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      {/* Folder Selection Modal */}
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
                {t('labels.selectFolder') || 'Select Folder'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.folderList}>
              {/* No folder option */}
              <TouchableOpacity
                style={[
                  styles.folderItem,
                  { borderBottomColor: theme.border },
                  !selectedFolderId && { backgroundColor: theme.primaryLight }
                ]}
                onPress={() => {
                  onSelectFolder(undefined);
                  setModalVisible(false);
                }}
              >
                <Ionicons name="folder-outline" size={24} color={theme.textSecondary} />
                <Text style={[styles.folderName, { color: theme.text }]}>
                  {t('labels.noFolder') || 'No folder'}
                </Text>
                {!selectedFolderId && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>

              {/* Folder list */}
              {availableFolders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderItem,
                    { borderBottomColor: theme.border },
                    selectedFolderId === folder.id && { backgroundColor: theme.primaryLight }
                  ]}
                  onPress={() => {
                    onSelectFolder(folder.id);
                    setModalVisible(false);
                  }}
                  onLongPress={() => openEditModal(folder)}
                >
                  <Ionicons name={folder.icon as any} size={24} color={folder.color} />
                  <Text style={[styles.folderName, { color: theme.text }]}>{folder.name}</Text>
                  {selectedFolderId === folder.id && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Create new folder button */}
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.primary }]}
              onPress={openCreateModal}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.createButtonText}>
                {t('labels.createFolder') || 'Create Folder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create/Edit Folder Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingFolder ? (t('labels.editFolder') || 'Edit Folder') : (t('labels.createFolder') || 'Create Folder')}
              </Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createForm}>
              {/* Preview */}
              <View style={styles.previewContainer}>
                <View style={[styles.previewIcon, { backgroundColor: newFolderColor + '20' }]}>
                  <Ionicons name={newFolderIcon as any} size={48} color={newFolderColor} />
                </View>
                <Text style={[styles.previewName, { color: theme.text }]}>
                  {newFolderName || (t('labels.newFolder') || 'New Folder')}
                </Text>
              </View>

              {/* Name input */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('labels.folderName') || 'Folder Name'}
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text
                }]}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder={t('placeholders.enterFolderName') || 'Enter folder name'}
                placeholderTextColor={theme.textSecondary}
              />

              {/* Icon picker */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('labels.icon') || 'Icon'}
              </Text>
              <View style={styles.iconGrid}>
                {FOLDER_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                      newFolderIcon === icon && { borderColor: newFolderColor, backgroundColor: newFolderColor + '20' }
                    ]}
                    onPress={() => setNewFolderIcon(icon)}
                  >
                    <Ionicons
                      name={icon as any}
                      size={24}
                      color={newFolderIcon === icon ? newFolderColor : theme.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Color picker */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('labels.color') || 'Color'}
              </Text>
              <View style={styles.colorGrid}>
                {FOLDER_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      newFolderColor === color && styles.colorSelected
                    ]}
                    onPress={() => setNewFolderColor(color)}
                  >
                    {newFolderColor === color && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Delete button (only for editing) */}
              {editingFolder && (
                <TouchableOpacity
                  style={[styles.deleteButton, { borderColor: theme.error }]}
                  onPress={() => {
                    handleDeleteFolder(editingFolder.id);
                    setCreateModalVisible(false);
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.error} />
                  <Text style={[styles.deleteButtonText, { color: theme.error }]}>
                    {t('common.delete') || 'Delete'}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {/* Save button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={editingFolder ? handleEditFolder : handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              <Text style={styles.saveButtonText}>
                {editingFolder ? (t('common.save') || 'Save') : (t('common.create') || 'Create')}
              </Text>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  folderList: {
    maxHeight: 300,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderBottomWidth: 1,
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createForm: {
    padding: 20,
    maxHeight: 400,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
