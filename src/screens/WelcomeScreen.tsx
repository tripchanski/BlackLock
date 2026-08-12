import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import Button from '../components/Button';
import { t } from '../services/i18n';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { setSettings } = useStore();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'uk' | 'ru'>('en');

  const languages = [
    { code: 'en' as const, name: 'English' },
    { code: 'uk' as const, name: 'Українська' },
    { code: 'ru' as const, name: 'Русский' },
  ];

  const handleContinue = async () => {
    await setSettings({ language: selectedLanguage });
    // @ts-ignore
    navigation.navigate('ProfileSetup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>

        <View style={styles.languageContainer}>
          <Text style={styles.label}>{t('welcome.selectLanguage')}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                selectedLanguage === lang.code && styles.languageOptionSelected,
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === lang.code && styles.languageTextSelected,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        title={t('welcome.continue')}
        onPress={handleContinue}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 48,
  },
  languageContainer: {
    marginTop: 32,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 16,
  },
  languageOption: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3a3a3a',
  },
  languageOptionSelected: {
    borderColor: '#4a9eff',
    backgroundColor: '#1a3a5a',
  },
  languageText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  languageTextSelected: {
    color: '#4a9eff',
  },
  button: {
    marginBottom: 24,
  },
});
