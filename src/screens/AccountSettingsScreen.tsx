import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import Input from '../components/Input';
import Button from '../components/Button';
import { t } from '../services/i18n';

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { account, updateAccount } = useStore();

  const [nickname, setNickname] = useState(account?.nickname || '');
  const [name, setName] = useState(account?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAccount({
        nickname: nickname.trim(),
        name: name.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('settings.account')}</Text>

        <Input
          label={t('profile.nickname')}
          value={nickname}
          onChangeText={setNickname}
        />

        <Input
          label={t('profile.name')}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Character Stats</Text>
          <StatRow label="Level" value={account?.level || 0} />
          <StatRow label="Experience" value={account?.experience || 0} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.footerButton}
        />
        <Button
          title={t('common.save')}
          onPress={handleSave}
          loading={loading}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 48,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#888',
  },
  statValue: {
    fontSize: 16,
    color: '#4a9eff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  footerButton: {
    flex: 1,
  },
});
