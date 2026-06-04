import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const stats = [
    { label: 'Stories Shared', value: '1,247' },
    { label: 'Countries', value: '89' },
    { label: 'States', value: '50' },
  ];

  const featured = [
    { name: 'Ana Martinez', country: 'Mexico', excerpt: 'From a small town to the New York skyline...' },
    { name: 'Kwame Mensah', country: 'Ghana', excerpt: 'A long journey across the sea and hope...' },
    { name: 'Liu Wei', country: 'China', excerpt: 'Finding work, family, and a place to belong...' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>My Journey to America</Text>
        <Text style={styles.tagline}>Every journey deserves to be remembered</Text>
      </View>

      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value} </Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Browse Stories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Share Your Story</Text>
        </TouchableOpacity>
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
  hero: { backgroundColor: '#0f172a', paddingVertical: 28, alignItems: 'center' },
  title: { color: '#d4a843', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  tagline: { color: '#d4a843', fontSize: 14, marginTop: 8, textAlign: 'center' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f6f0',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: '#0f172a', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#0f172a', fontSize: 12, marginTop: 6 },

  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#d4a843',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  primaryButtonText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },

  sectionHeading: { color: '#f8f6f0', fontSize: 20, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  cardsContainer: { },
  card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTitle: { color: '#f8f6f0', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  cardExcerpt: { color: '#f8f6f0', fontSize: 14, marginTop: 8 },
});

