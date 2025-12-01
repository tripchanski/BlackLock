import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
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
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
];

export default function CreateFolderModal({ visible, onClose }: CreateFolderModalProps) {
  const theme = useTheme();
  const { folders, addFolder } = useStore();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('folder');
  const [color, setColor] = useState('#6366f1');

  const handleCreate = async () => {
    if (!name.trim()) return;

    await addFolder({
      name: name.trim(),
      icon,
      color,
      order: folders.length,
    });

    setName('');
    setIcon('folder');
    setColor('#6366f1');
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
              {t('labels.createFolder') || 'Create Folder'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {/* Preview */}
            <View style={styles.preview}>
              <View style={[styles.previewIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={40} color={color} />
              </View>
              <Text style={[styles.previewName, { color: theme.text }]}>
                {name || (t('labels.newFolder') || 'New Folder')}
              </Text>
            </View>

            {/* Name */}
            <Text style={[styles.label, { color: theme.text }]}>
              {t('labels.folderName') || 'Folder Name'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
              value={name}
              onChangeText={setName}
              placeholder={t('placeholders.enterFolderName') || 'Enter folder name'}
              placeholderTextColor={theme.textSecondary}
            />

            {/* Icons */}
            <Text style={[styles.label, { color: theme.text }]}>
              {t('labels.icon') || 'Icon'}
            </Text>
            <View style={styles.iconGrid}>
              {FOLDER_ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[
                    styles.iconOption,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    icon === ic && { borderColor: color, backgroundColor: color + '20' }
                  ]}
                  onPress={() => setIcon(ic)}
                >
                  <Ionicons name={ic as any} size={22} color={icon === ic ? color : theme.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Colors */}
            <Text style={[styles.label, { color: theme.text }]}>
              {t('labels.color') || 'Color'}
            </Text>
            <View style={styles.colorGrid}>
              {FOLDER_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorOption, { backgroundColor: c }, color === c && styles.colorSelected]}
                  onPress={() => setColor(c)}
                >
                  {color === c && <Ionicons name="checkmark" size={16} color="#fff" />}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: theme.primary, opacity: name.trim() ? 1 : 0.5 }]}
            onPress={handleCreate}
            disabled={!name.trim()}
          >
            <Text style={styles.createBtnText}>{t('common.create') || 'Create'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
  form: {
    padding: 20,
  },
  preview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
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
    width: 42,
    height: 42,
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
  createBtn: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
