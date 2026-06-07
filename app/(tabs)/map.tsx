import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_WIDTH * 0.65;

// Dots positioned as percentages of map width/height to represent origin regions
const DOTS = [
  // Latin America
  { top: '55%', left: '22%' },
  { top: '62%', left: '26%' },
  { top: '68%', left: '24%' },
  { top: '58%', left: '18%' },
  // Caribbean
  { top: '48%', left: '27%' },
  // North America
  { top: '35%', left: '16%' },
  // West Africa
  { top: '52%', left: '46%' },
  { top: '58%', left: '50%' },
  // East Africa
  { top: '55%', left: '56%' },
  // Middle East
  { top: '40%', left: '57%' },
  { top: '44%', left: '60%' },
  // South Asia
  { top: '42%', left: '66%' },
  { top: '48%', left: '68%' },
  // Southeast Asia
  { top: '52%', left: '76%' },
  { top: '55%', left: '80%' },
  // East Asia
  { top: '36%', left: '78%' },
  { top: '40%', left: '74%' },
  // Europe
  { top: '28%', left: '48%' },
  { top: '32%', left: '52%' },
  { top: '26%', left: '54%' },
  // Eastern Europe / Central Asia
  { top: '30%', left: '60%' },
  { top: '28%', left: '65%' },
];

const TOP_COUNTRIES = [
  { flag: '🇲🇽', name: 'Mexico', count: 142 },
  { flag: '🇮🇳', name: 'India', count: 118 },
  { flag: '🇨🇳', name: 'China', count: 97 },
  { flag: '🇵🇭', name: 'Philippines', count: 84 },
  { flag: '🇸🇻', name: 'El Salvador', count: 61 },
];

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journey Map</Text>
      <Text style={styles.subheader}>Stories from around the world</Text>

      <View style={styles.mapContainer}>
        {DOTS.map((dot, i) => (
          <View
            key={i}
            style={[styles.dot, { top: dot.top as any, left: dot.left as any }]}
          />
        ))}
        <View style={styles.mapOverlay}>
          <Text style={styles.mapIcon}>🌍</Text>
          <Text style={styles.mapLabel}>Interactive Map</Text>
          <Text style={styles.mapSub}>Showing stories from 89 countries</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Top origin countries</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {TOP_COUNTRIES.map((c) => (
          <View key={c.name} style={styles.chip}>
            <Text style={styles.chipFlag}>{c.flag}</Text>
            <Text style={styles.chipName}>{c.name}</Text>
            <Text style={styles.chipCount}>{c.count}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },

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
  },

  mapContainer: {
    height: MAP_HEIGHT,
    marginHorizontal: 24,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d4a843',
    opacity: 0.85,
  },
  mapOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  mapIcon: { fontSize: 36, marginBottom: 8 },
  mapLabel: { color: '#d4a843', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  mapSub: { color: '#f8f6f0', fontSize: 14 },

  sectionLabel: {
    color: '#f8f6f0',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 12,
  },

  chipsScroll: { flexGrow: 0 },
  chipsContent: { paddingHorizontal: 24, gap: 10, paddingBottom: 4 },
  chip: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 90,
  },
  chipFlag: { fontSize: 24, marginBottom: 4 },
  chipName: { color: '#d4a843', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  chipCount: { color: '#94a3b8', fontSize: 12 },
});
