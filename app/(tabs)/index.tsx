import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WorldMapSVG = () => {
  return (
    <View style={styles.mapSvgContainer}>
      <View style={[styles.mapLine, { top: '20%', left: '10%', width: 80, height: 40 }]} />
      <View style={[styles.mapLine, { top: '25%', left: '50%', width: 60, height: 50 }]} />
      <View style={[styles.mapLine, { top: '40%', left: '70%', width: 50, height: 30 }]} />
      <View style={[styles.mapLine, { top: '50%', left: '20%', width: 40, height: 60 }]} />
      <View style={[styles.mapLine, { top: '60%', left: '60%', width: 70, height: 40 }]} />
    </View>
  );
};

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
        <WorldMapSVG />
        <Text style={styles.smallTag}>AN ARCHIVE OF IMMIGRATION STORIES</Text>
        <Text style={styles.headline}>
          <Text style={styles.headlineWhite}>Every Journey</Text>
          <Text style={styles.headlineGold}> Tells a Story.</Text>
        </Text>
        <Text style={styles.subtextLine1}>A living archive of immigration stories — told by the people who lived them.</Text>
        <Text style={styles.subtextLine2}>Discover where people came from, how they arrived, and who they became.</Text>

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

  mapSvgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  mapLine: {
    position: 'absolute',
    backgroundColor: '#d4a843',
    opacity: 0.6,
    borderRadius: 3,
  },

  hero: { paddingTop: 60, paddingBottom: 28, alignItems: 'center', position: 'relative', zIndex: 10 },
  smallTag: { color: '#d4a843', fontSize: 11, letterSpacing: 1.4, marginBottom: 20, fontWeight: '700', textTransform: 'uppercase' },
  headline: { fontSize: 32, fontWeight: '800', textAlign: 'center', lineHeight: 40 },
  headlineWhite: { color: '#ffffff' },
  headlineGold: { color: '#d4a843' },
  subtextLine1: { color: '#f8f6f0', fontSize: 14, textAlign: 'center', marginTop: 20 },
  subtextLine2: { color: '#f8f6f0', fontSize: 14, textAlign: 'center', marginTop: 10 },

  heroButtons: { flexDirection: 'row', marginTop: 28 },
  filledButton: { backgroundColor: '#d4a843', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, marginHorizontal: 8 },
  filledButtonText: { color: '#0f172a', fontWeight: '700' },
  outlineButton: { borderWidth: 2, borderColor: '#d4a843', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginHorizontal: 8 },
  outlineButtonText: { color: '#d4a843', fontWeight: '700' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  statItem: { alignItems: 'center', flex: 1, padding: 12, marginHorizontal: 6 },
  statValue: { color: '#d4a843', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#f8f6f0', fontSize: 12, marginTop: 6, textAlign: 'center' },

  sectionHeading: { color: '#f8f6f0', fontSize: 20, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  cardsContainer: {},
  card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTitle: { color: '#f8f6f0', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  cardExcerpt: { color: '#f8f6f0', fontSize: 14, marginTop: 8 },
});
