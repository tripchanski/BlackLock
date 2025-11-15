import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useStore } from '../services/store';
import { useTheme } from '../hooks/useTheme';
import { t } from '../services/i18n';
import Card from '../components/Card';
import Button from '../components/Button';

export default function BackupSettingsScreen() {
  const theme = useTheme();
  const { exportData, importData } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
});
