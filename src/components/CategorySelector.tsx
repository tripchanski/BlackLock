import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { Category } from '../types';
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from '../constants/categories';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';
import Input from './Input';
import Button from './Button';

interface CategorySelectorProps {
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySelector({ selectedCategoryId, onSelectCategory }: CategorySelectorProps) {
  const theme = useTheme();
  const { categories, addCategory } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const handleSelectCategory = (categoryId: string) => {
    onSelectCategory(categoryId);
    setModalVisible(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert(t('errors.enterCategoryName'));
      return;
    }

    try {
      await addCategory({
        name: newCategoryName.trim(),
        icon: selectedIcon,
        color: selectedColor,
        isDefault: false,
      });

      const newCategory = categories.find(c => c.name === newCategoryName.trim());
      if (newCategory) {
        onSelectCategory(newCategory.id);
      }

      setModalVisible(false);
      setCreateMode(false);
      setNewCategoryName('');
      setSelectedIcon('star');
      setSelectedColor(AVAILABLE_COLORS[0]);
    } catch (error) {
      console.error('Error creating category:', error);
      alert(t('errors.createCategoryFailed'));
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedCategory ? (
            <>
              <View style={[styles.iconContainer, { backgroundColor: selectedCategory.color }]}>
                <Ionicons name={selectedCategory.icon as any} size={20} color="#fff" />
              </View>
              <Text style={[styles.selectorText, { color: theme.text }]}>
                {selectedCategory.isDefault ? t(`categories.${selectedCategory.name.toLowerCase()}`) : selectedCategory.name}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="apps-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.selectorTextPlaceholder, { color: theme.textSecondary }]}>Select Category</Text>
            </>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          setCreateMode(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {!createMode ? (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Select Category</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.categoriesScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.categoriesGrid}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryCard,
                          {
                            backgroundColor: theme.surface,
                            borderColor: selectedCategoryId === category.id ? theme.primary : theme.border,
                          },
                          selectedCategoryId === category.id && { backgroundColor: theme.primaryLight },
                        ]}
                        onPress={() => handleSelectCategory(category.id)}
                      >
                        <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                          <Ionicons name={category.icon as any} size={24} color="#fff" />
                        </View>
                        <Text style={[styles.categoryName, { color: theme.text }]}>
                          {category.isDefault ? t(`categories.${category.name.toLowerCase()}`) : category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                    onPress={() => setCreateMode(true)}
                  >
                    <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                    <Text style={[styles.createButtonText, { color: theme.primary }]}>Create New Category</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            ) : (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                  <TouchableOpacity onPress={() => setCreateMode(false)}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Create Category</Text>
                  <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.createScroll} showsVerticalScrollIndicator={false}>
                  {/* Preview */}
                  <View style={styles.preview}>
                    <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
                      <Ionicons name={selectedIcon as any} size={40} color={selectedColor} />
                    </View>
                    <Text style={[styles.previewName, { color: theme.text }]}>
                      {newCategoryName || (t('labels.newCategory') || 'New Category')}
                    </Text>
                  </View>

                  {/* Name */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    {t('labels.categoryName') || 'Category Name'}
                  </Text>
                  <Input
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder={t('placeholders.enterCategoryName') || 'Enter category name'}
                  />

                  {/* Icons */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    {t('labels.icon') || 'Icon'}
                  </Text>
                  <View style={styles.iconGrid}>
                    {AVAILABLE_ICONS.map((icon) => (
                      <TouchableOpacity
                        key={icon}
                        style={[
                          styles.iconOption,
                          { backgroundColor: theme.surface, borderColor: theme.border },
                          selectedIcon === icon && { borderColor: selectedColor, backgroundColor: selectedColor + '20' }
                        ]}
                        onPress={() => setSelectedIcon(icon)}
                      >
                        <Ionicons name={icon as any} size={22} color={selectedIcon === icon ? selectedColor : theme.textSecondary} />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Colors */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    {t('labels.color') || 'Color'}
                  </Text>
                  <View style={styles.colorGrid}>
                    {AVAILABLE_COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.colorSelected]}
                        onPress={() => setSelectedColor(color)}
                      >
                        {selectedColor === color && <Ionicons name="checkmark" size={16} color="#fff" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[styles.createBtn, { backgroundColor: theme.primary, opacity: newCategoryName.trim() ? 1 : 0.5 }]}
                  onPress={handleCreateCategory}
                  disabled={!newCategoryName.trim()}
                >
                  <Text style={styles.createBtnText}>{t('common.create') || 'Create'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectorTextPlaceholder: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 32,
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
  categoriesScroll: {
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  categoryCardSelected: {
    // Styles applied inline with theme
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createScroll: {
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
