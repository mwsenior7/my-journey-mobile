import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const STATS = [
  { value: '1,247', label: 'Stories' },
  { value: '89', label: 'Countries' },
  { value: '50', label: 'States' },
];

const REGIONS = [
  { emoji: '🌎', name: 'Latin America', count: 487, bar: 1.0 },
  { emoji: '🌏', name: 'East & Southeast Asia', count: 312, bar: 0.64 },
  { emoji: '🌍', name: 'South Asia', count: 289, bar: 0.59 },
  { emoji: '🌍', name: 'Middle East & Africa', count: 198, bar: 0.41 },
  { emoji: '🌍', name: 'Europe', count: 134, bar: 0.28 },
  { emoji: '🌎', name: 'Caribbean', count: 89, bar: 0.18 },
];

export default function MapScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Journey Map</Text>
      <Text style={styles.subheader}>Stories by Region</Text>

      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {REGIONS.map((r) => (
        <View key={r.name} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardEmoji}>{r.emoji}</Text>
            <View style={styles.cardMid}>
              <Text style={styles.cardName}>{r.name}</Text>
              <Text style={styles.cardCount}>{r.count} stories</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/browse')} activeOpacity={0.7}>
              <Text style={styles.exploreBtn}>Explore →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${r.bar * 100}%` }]} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 48 },

  header: {
    color: '#d4a843',
    fontSize: 28,
    fontWeight: '700',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  subheader: {
    color: '#f8f6f0',
    fontSize: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { color: '#d4a843', fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: '#f8f6f0', fontSize: 12 },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEmoji: { fontSize: 32, marginRight: 12 },
  cardMid: { flex: 1 },
  cardName: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 2 },
  cardCount: { color: '#d4a843', fontSize: 14 },
  exploreBtn: { color: '#d4a843', fontSize: 14, fontWeight: '700' },

  barTrack: {
    height: 4,
    backgroundColor: '#0f172a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    backgroundColor: '#d4a843',
    borderRadius: 2,
  },
});
