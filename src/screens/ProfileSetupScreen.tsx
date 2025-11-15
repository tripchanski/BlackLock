import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import { database } from '../services/database';
import Button from '../components/Button';
import Input from '../components/Input';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const { setIsFirstLaunch, loadAccount } = useStore();
  const theme = useTheme();
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!nickname.trim()) {
      alert(t('errors.enterNickname'));
      return;
    }

    setLoading(true);
    try {
      await database.createAccount({
        nickname: nickname.trim(),
        name: name.trim() || undefined,
        level: 1,
        experience: 0,
      });

      await loadAccount();
      await setIsFirstLaunch(false);

      // Navigation will automatically switch to MainTabs
    } catch (error) {
      console.error('Error creating account:', error);
      alert(t('errors.createAccountFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{t('profile.setupProfile')}</Text>

        <Input
          label={t('profile.nickname')}
          value={nickname}
          onChangeText={setNickname}
          placeholder={t('placeholders.enterNickname')}
        />

        <Input
          label={t('profile.name')}
          value={name}
          onChangeText={setName}
          placeholder={t('placeholders.enterName')}
        />

        <Text style={[styles.info, { color: theme.textSecondary }]}>
          You can always change these settings later in your profile.
        </Text>
      </ScrollView>

      <Button
        title={t('profile.createAccount')}
        onPress={handleCreateAccount}
        disabled={!nickname.trim()}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  info: {
    fontSize: 14,
    marginTop: 16,
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
  },
});
