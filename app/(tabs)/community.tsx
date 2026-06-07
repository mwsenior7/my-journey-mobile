import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const HUBS = [
  { emoji: '🌎', name: 'Latin America', description: 'Stories from Mexico, Central and South America' },
  { emoji: '🌏', name: 'South Asia', description: 'Stories from India, Pakistan, Bangladesh and beyond' },
  { emoji: '🌍', name: 'Middle East & Africa', description: 'Stories from across the Middle East and African continent' },
  { emoji: '🌍', name: 'Europe', description: 'Stories from across Europe' },
  { emoji: '🌏', name: 'East & Southeast Asia', description: 'Stories from China, Philippines, Vietnam and more' },
  { emoji: '🌎', name: 'Caribbean', description: 'Stories from Cuba, Haiti, Jamaica and the islands' },
];

export default function CommunityScreen() {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggleJoin = (name: string) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
        Alert.alert('Hub Joined', `You've joined the ${name} hub.`);
      }
      return next;
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Community Hubs</Text>
      <Text style={styles.subheader}>Connect with others who share your journey</Text>

      {HUBS.map((hub) => {
        const isJoined = joined.has(hub.name);
        return (
          <View key={hub.name} style={styles.card}>
            <Text style={styles.emoji}>{hub.emoji}</Text>
            <Text style={styles.hubName}>{hub.name}</Text>
            <Text style={styles.hubDescription}>{hub.description}</Text>
            <TouchableOpacity
              style={[styles.joinButton, isJoined && styles.joinButtonActive]}
              activeOpacity={0.8}
              onPress={() => toggleJoin(hub.name)}
            >
              <Text style={[styles.joinButtonText, isJoined && styles.joinButtonTextActive]}>
                {isJoined ? 'Joined ✓' : 'Join Hub'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 40 },

  header: {
    color: '#d4a843',
    fontSize: 28,
    fontWeight: '700',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  subheader: {
    color: '#f8f6f0',
    fontSize: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    lineHeight: 24,
  },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  emoji: { fontSize: 40, marginBottom: 12 },
  hubName: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  hubDescription: { color: '#f8f6f0', fontSize: 14, lineHeight: 22, marginBottom: 16 },

  joinButton: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#d4a843',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  joinButtonActive: { backgroundColor: '#d4a843' },
  joinButtonText: { color: '#d4a843', fontSize: 14, fontWeight: '700' },
  joinButtonTextActive: { color: '#0f172a' },
});
