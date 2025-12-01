import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Minimal test app to check if basic rendering works
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>BlackLock Test Mode</Text>
      <Text style={styles.subtext}>If you see this, React Native is working!</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#4a9eff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtext: {
    color: '#888',
    fontSize: 16,
  },
});
