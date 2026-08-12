import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import { database } from '../services/database';
import Button from '../components/Button';
import Input from '../components/Input';
import { t } from '../services/i18n';

export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const { setIsFirstLaunch, loadAccount } = useStore();
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!nickname.trim()) {
      alert('Please enter a nickname');
      return;
    }

    setLoading(true);
    try {
      await database.createAccount({
        nickname: nickname.trim(),
        name: name.trim() || undefined,
        level: 1,
        experience: 0,
        stats: {
          strength: 0,
          knowledge: 0,
          wisdom: 0,
          endurance: 0,
          charisma: 0,
        },
      });

      await loadAccount();
      await setIsFirstLaunch(false);

      // Navigation will automatically switch to MainTabs
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('profile.setupProfile')}</Text>

        <Input
          label={t('profile.nickname')}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Enter your nickname"
        />

        <Input
          label={t('profile.name')}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name (optional)"
        />

        <Text style={styles.info}>
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
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
  },
});
