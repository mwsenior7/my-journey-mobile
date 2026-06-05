import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const stats = [
    { label: 'Stories archived', value: '1,247' },
    { label: 'Countries represented', value: '89' },
    { label: 'US states covered', value: '50' },
  ];

  const featured = [
    { name: 'Ana Martinez', country: 'Mexico', excerpt: 'From a small town to the New York skyline...' },
    { name: 'Kwame Mensah', country: 'Ghana', excerpt: 'A long journey across the sea and hope...' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.smallTag}>AN ARCHIVE OF IMMIGRATION STORIES</Text>
        <Text style={styles.headline}>
          <Text style={styles.headlineWhite}>Every Journey </Text>
          <Text style={styles.headlineGold}>Tells a Story.</Text>
        </Text>
        <Text style={styles.subtext}>
          A living archive of immigration stories — told by the people who lived them. Discover where people came from, how they arrived, and who they became.
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.filledButton} activeOpacity={0.85}>
            <Text style={styles.filledButtonText}>Browse Stories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
            <Text style={styles.outlineButtonText}>Share Your Story</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionHeading}>Featured Stories</Text>
      <View style={styles.cardsContainer}>
        {featured.map((f) => (
          <View key={f.name} style={styles.card}>
            <Text style={styles.cardTitle}>{f.name}</Text>
            <Text style={styles.cardMeta}>{f.country}</Text>
            <Text style={styles.cardExcerpt}>{f.excerpt}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 40 },

  hero: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 0,
    alignItems: 'center',
  },
  smallTag: {
    color: '#d4a843',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 24,
    textAlign: 'center',
  },
  headline: {
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  headlineWhite: { color: '#ffffff' },
  headlineGold: { color: '#d4a843' },
  subtext: {
    color: '#f8f6f0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 36,
  },

  heroButtons: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  filledButton: {
    backgroundColor: '#d4a843',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  filledButtonText: { color: '#0f172a', fontWeight: '700', fontSize: 15 },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#d4a843',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  outlineButtonText: { color: '#d4a843', fontWeight: '700', fontSize: 15 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: '#d4a843', fontSize: 32, fontWeight: '800' },
  statLabel: { color: '#f8f6f0', fontSize: 13, marginTop: 6, textAlign: 'center' },

  sectionHeading: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  cardsContainer: { paddingHorizontal: 24 },
  card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#f8f6f0', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  cardExcerpt: { color: '#f8f6f0', fontSize: 14, marginTop: 8, lineHeight: 22 },
});
