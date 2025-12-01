import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { storage, BackupMetadata } from '../services/storage';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';
import Card from '../components/Card';
import Button from '../components/Button';

export default function BackupSettingsScreen() {
  const theme = useTheme();
  const { exportData, importData } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [autoBackups, setAutoBackups] = useState<BackupMetadata[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(true);

  // Load auto backups on mount
  useEffect(() => {
    loadAutoBackups();
  }, []);

  const loadAutoBackups = async () => {
    try {
      const backups = await storage.listBackups();
      setAutoBackups(backups);
    } catch (error) {
      console.error('Failed to load backups:', error);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const jsonData = await exportData();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `blacklock-backup-${timestamp}.json`;

      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: t('settings.exportData'),
        });

        Alert.alert(t('labels.success'), t('settings.exportSuccess'));
      } else {
        Alert.alert(t('labels.error'), 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(t('labels.error'), t('settings.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateAutoBackup = async () => {
    try {
      setIsExporting(true);
      await storage.createBackup();
      await loadAutoBackups();
      Alert.alert(t('labels.success'), 'Auto backup created successfully!');
    } catch (error) {
      console.error('Auto backup error:', error);
      Alert.alert(t('labels.error'), 'Failed to create auto backup');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreBackup = async (filename: string, date: string) => {
    Alert.alert(
      'Restore Backup?',
      `This will restore data from ${date}. Current data will be backed up first.`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsImporting(true);
              await storage.restoreBackup(filename);
              Alert.alert(t('labels.success'), 'Backup restored successfully! Please restart the app.');
            } catch (error) {
              console.error('Restore error:', error);
              Alert.alert(t('labels.error'), 'Failed to restore backup');
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteBackup = async (filename: string) => {
    Alert.alert(
      'Delete Backup?',
      'This action cannot be undone.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteBackup(filename);
              await loadAutoBackups();
              Alert.alert(t('labels.success'), 'Backup deleted');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert(t('labels.error'), 'Failed to delete backup');
            }
          },
        },
      ]
    );
  };

  const handleExportBackup = async (filename: string) => {
    try {
      const exportPath = await storage.exportBackup(filename);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(exportPath, {
          mimeType: 'application/json',
          dialogTitle: 'Export Backup',
        });
      }
    } catch (error) {
      console.error('Export backup error:', error);
      Alert.alert(t('labels.error'), 'Failed to export backup');
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);

      // Pick a file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);

      Alert.alert(
        t('settings.importData'),
        t('warnings.importWillReplace'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => setIsImporting(false),
          },
          {
            text: t('common.confirm'),
            style: 'destructive',
            onPress: async () => {
              try {
                await importData(fileContent);
                Alert.alert(t('labels.success'), t('settings.importSuccess'));
              } catch (error: any) {
                console.error('Import error:', error);
                if (error.message.includes('Invalid backup')) {
                  Alert.alert(t('labels.error'), t('settings.invalidBackup'));
                } else {
                  Alert.alert(t('labels.error'), t('settings.importError'));
                }
              } finally {
                setIsImporting(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(t('labels.error'), t('settings.importError'));
      setIsImporting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>{t('settings.backup')}</Text>

      {/* Export Data Card */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {t('settings.exportData')}
        </Text>
        <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
          {t('settings.exportDescription')}
        </Text>
        <Button
          title={t('settings.exportData')}
          onPress={handleExport}
          loading={isExporting}
          disabled={isExporting}
          style={styles.button}
        />
      </Card>

      {/* Import Data Card */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {t('settings.importData')}
        </Text>
        <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
          {t('settings.importDescription')}
        </Text>
        <Button
          title={t('settings.importData')}
          onPress={handleImport}
          loading={isImporting}
          disabled={isImporting}
          variant="secondary"
          style={styles.button}
        />
      </Card>

      {/* Auto Backups Card */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Auto Backups ({autoBackups.length})
          </Text>
          <TouchableOpacity onPress={handleCreateAutoBackup} disabled={isExporting}>
            <Ionicons name="add-circle" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
          Automatic backups are kept for 7 days
        </Text>

        {isLoadingBackups ? (
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading backups...</Text>
        ) : autoBackups.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No backups yet</Text>
        ) : (
          autoBackups.map((backup) => (
            <View
              key={backup.filename}
              style={[styles.backupItem, { borderBottomColor: theme.border }]}
            >
              <View style={styles.backupInfo}>
                <Text style={[styles.backupDate, { color: theme.text }]}>
                  {backup.date}
                </Text>
                <Text style={[styles.backupSize, { color: theme.textSecondary }]}>
                  {formatBytes(backup.size)}
                </Text>
              </View>
              <View style={styles.backupActions}>
                <TouchableOpacity
                  onPress={() => handleRestoreBackup(backup.filename, backup.date)}
                  style={styles.actionButton}
                >
                  <Ionicons name="refresh" size={20} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleExportBackup(backup.filename)}
                  style={styles.actionButton}
                >
                  <Ionicons name="share-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteBackup(backup.filename)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </Card>

      {/* Warning Card */}
      <Card style={[styles.warningCard, { backgroundColor: theme.warning + '20' }]}>
        <Text style={[styles.warningIcon, { color: theme.warning }]}>⚠️</Text>
        <Text style={[styles.warningText, { color: theme.text }]}>
          {t('warnings.backupImportant')}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 48,
    marginBottom: 24,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
  warningCard: {
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  backupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backupInfo: {
    flex: 1,
  },
  backupDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  backupSize: {
    fontSize: 12,
  },
  backupActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});
