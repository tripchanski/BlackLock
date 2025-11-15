import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../services/store';
import Input from '../components/Input';
import Button from '../components/Button';
import { t } from '../services/i18n';
import { useTheme } from '../hooks/useTheme';

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { account, updateAccount } = useStore();
  const theme = useTheme();

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
      alert(t('errors.updateAccountFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{t('settings.account')}</Text>

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

        <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>{t('statistics.characterStats')}</Text>
          <StatRow label="Level" value={account?.level || 0} theme={theme} />
          <StatRow label="Experience" value={account?.experience || 0} theme={theme} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
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

function StatRow({ label, value, theme }: { label: string; value: number; theme: any }) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 48,
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});
