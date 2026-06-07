import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const VALUES = [
  { emoji: '🕊️', name: 'Dignity', description: 'Every story is treated with respect and care' },
  { emoji: '🤝', name: 'Belonging', description: 'Building community across cultures and borders' },
  { emoji: '📖', name: 'Memory', description: 'Preserving stories for future generations' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>About</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Our Mission</Text>
        <Text style={styles.missionText}>
          My Journey to America is a living archive of immigration stories — told by the people who lived them. We believe every journey deserves to be remembered, honored, and shared.
        </Text>
      </View>

      <View style={styles.valuesSection}>
        {VALUES.map((v) => (
          <View key={v.name} style={styles.valueCard}>
            <Text style={styles.valueEmoji}>{v.emoji}</Text>
            <View style={styles.valueText}>
              <Text style={styles.valueName}>{v.name}</Text>
              <Text style={styles.valueDescription}>{v.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={() => router.push('/(tabs)/share')}>
        <Text style={styles.ctaButtonText}>Share Your Story</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 60 },

  header: {
    color: '#d4a843',
    fontSize: 28,
    fontWeight: '700',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeading: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  missionText: {
    color: '#f8f6f0',
    fontSize: 16,
    lineHeight: 26,
  },

  valuesSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
    gap: 12,
  },
  valueCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueEmoji: { fontSize: 32, marginRight: 16 },
  valueText: { flex: 1 },
  valueName: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  valueDescription: { color: '#f8f6f0', fontSize: 14, lineHeight: 20 },

  ctaButton: {
    backgroundColor: '#d4a843',
    borderRadius: 10,
    paddingVertical: 14,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  ctaButtonText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
});
