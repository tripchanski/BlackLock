import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleCreateProfile = () => {
    navigation.navigate('LanguageSelection' as never, { action: 'create' } as never);
  };

  const handleImportData = () => {
    navigation.navigate('LanguageSelection' as never, { action: 'import' } as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{t('welcome.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('welcome.subtitle')}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={t('welcome.createProfile')}
          onPress={handleCreateProfile}
          style={styles.button}
        />
        <Button
          title={t('welcome.importData')}
          onPress={handleImportData}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  button: {
    marginBottom: 0,
  },
});
