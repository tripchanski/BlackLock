import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useStore } from '../services/store';
import { SupportedLanguage } from '../types';
import Button from '../components/Button';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

type LanguageSelectionRouteParams = {
  action: 'create' | 'import';
};

export default function LanguageSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: LanguageSelectionRouteParams }, 'params'>>();
  const { setSettings, importData } = useStore();
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isImporting, setIsImporting] = useState(false);

  const languages: Array<{ code: SupportedLanguage; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' },
    { code: 'pt', name: 'Português' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ur', name: 'اردو' },
    { code: 'az', name: 'Azərbaycan' },
    { code: 'tr', name: 'Türkçe' },
  ];

  const handleContinue = async () => {
    await setSettings({ language: selectedLanguage });

    if (route.params?.action === 'import') {
      await handleImport();
    } else {
      navigation.navigate('ProfileSetup' as never);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      await importData(fileContent);
      Alert.alert(t('labels.success'), t('settings.importSuccess'));
      setIsImporting(false);
    } catch (error) {
      Alert.alert(t('labels.error'), t('settings.importError'));
      setIsImporting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t('welcome.selectLanguage')}</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              activeOpacity={0.7}
              style={[
                styles.languageOption,
                { backgroundColor: theme.surface, borderColor: theme.border },
                selectedLanguage === lang.code && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.languageText,
                  { color: theme.textSecondary },
                  selectedLanguage === lang.code && { color: theme.primary },
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Button
        title={t('welcome.continue')}
        onPress={handleContinue}
        style={styles.button}
        disabled={isImporting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  languageContainer: {
    paddingBottom: 24,
  },
  languageOption: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
});
