import React from 'react';
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
        <View style={styles.mapDecor} />
        <Text style={styles.smallTag}>AN ARCHIVE OF IMMIGRATION STORIES</Text>
        <Text style={styles.headline}>
          <Text style={styles.headlineWhite}>Every Journey</Text>
          <Text style={styles.headlineGold}> Tells a Story.</Text>
        </Text>
        <Text style={styles.subtext}>A living archive of immigration stories — told by the people who lived them.</Text>

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
  content: { padding: 20, paddingBottom: 40 },

  hero: { paddingVertical: 28, alignItems: 'center', position: 'relative' },
  mapDecor: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 220,
    height: 120,
    backgroundColor: '#d4a843',
    opacity: 0.05,
    borderRadius: 8,
    transform: [{ rotate: '-12deg' }],
  },
  smallTag: { color: '#d4a843', fontSize: 12, letterSpacing: 1.2, marginBottom: 12, fontWeight: '700' },
  headline: { fontSize: 34, fontWeight: '800', textAlign: 'center', lineHeight: 40 },
  headlineWhite: { color: '#ffffff' },
  headlineGold: { color: '#d4a843' },
  subtext: { color: '#f8f6f0', fontSize: 14, textAlign: 'center', marginTop: 10, maxWidth: 600 },

  heroButtons: { flexDirection: 'row', marginTop: 18 },
  filledButton: { backgroundColor: '#d4a843', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, marginHorizontal: 8 },
  filledButtonText: { color: '#0f172a', fontWeight: '700' },
  outlineButton: { borderWidth: 2, borderColor: '#d4a843', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginHorizontal: 8 },
  outlineButtonText: { color: '#d4a843', fontWeight: '700' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  statItem: { alignItems: 'center', flex: 1, padding: 12, marginHorizontal: 6, backgroundColor: 'transparent' },
  statValue: { color: '#d4a843', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#f8f6f0', fontSize: 12, marginTop: 6, textAlign: 'center' },

  sectionHeading: { color: '#f8f6f0', fontSize: 20, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  cardsContainer: {},
  card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTitle: { color: '#f8f6f0', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  cardExcerpt: { color: '#f8f6f0', fontSize: 14, marginTop: 8 },
});


