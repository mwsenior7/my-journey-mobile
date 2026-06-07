import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Rough continent shapes as positioned rectangles (left/top as % strings, width/height in px)
const CONTINENTS = [
  // North America
  { top: '8%', left: '4%', width: 90, height: 70, borderRadius: 6 },
  { top: '22%', left: '8%', width: 70, height: 50, borderRadius: 4 },
  // South America
  { top: '48%', left: '16%', width: 60, height: 80, borderRadius: 8 },
  // Europe
  { top: '12%', left: '44%', width: 50, height: 40, borderRadius: 5 },
  // Africa
  { top: '34%', left: '46%', width: 65, height: 90, borderRadius: 10 },
  // Asia (large — split into two blocks)
  { top: '8%', left: '55%', width: 130, height: 65, borderRadius: 6 },
  { top: '28%', left: '62%', width: 90, height: 55, borderRadius: 6 },
  // Australia
  { top: '62%', left: '74%', width: 55, height: 38, borderRadius: 8 },
];

// Story origin dots scattered to represent countries
const DOTS = [
  // Latin America / Caribbean
  { top: '52%', left: '18%' },
  { top: '60%', left: '22%' },
  { top: '67%', left: '20%' },
  { top: '46%', left: '26%' },
  { top: '57%', left: '15%' },
  // North America
  { top: '30%', left: '12%' },
  { top: '22%', left: '8%' },
  // West Africa
  { top: '50%', left: '46%' },
  { top: '57%', left: '50%' },
  // East Africa
  { top: '54%', left: '57%' },
  // Middle East
  { top: '38%', left: '58%' },
  { top: '43%', left: '61%' },
  // South Asia
  { top: '42%', left: '67%' },
  { top: '48%', left: '70%' },
  // Southeast Asia
  { top: '50%', left: '78%' },
  { top: '54%', left: '82%' },
  // East Asia
  { top: '28%', left: '78%' },
  { top: '33%', left: '74%' },
  // Europe
  { top: '18%', left: '47%' },
  { top: '22%', left: '52%' },
  { top: '15%', left: '54%' },
  // Eastern Europe / Central Asia
  { top: '20%', left: '61%' },
  { top: '16%', left: '66%' },
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

      {/* Map panel */}
      <View style={styles.mapContainer}>
        {/* Continent shapes */}
        {CONTINENTS.map((c, i) => (
          <View
            key={i}
            style={[
              styles.continent,
              {
                top: c.top as any,
                left: c.left as any,
                width: c.width,
                height: c.height,
                borderRadius: c.borderRadius,
              },
            ]}
          />
        ))}
        {/* Story origin dots */}
        {DOTS.map((d, i) => (
          <View
            key={i}
            style={[styles.dot, { top: d.top as any, left: d.left as any }]}
          />
        ))}
      </View>

      <Text style={styles.countLabel}>Showing stories from 89 countries</Text>

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
            <Text style={styles.chipCount}>{c.count} stories</Text>
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
    marginBottom: 6,
  },
  subheader: {
    color: '#f8f6f0',
    fontSize: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  mapContainer: {
    height: 350,
    width: SCREEN_WIDTH,
    backgroundColor: '#1e293b',
    position: 'relative',
    overflow: 'hidden',
  },
  continent: {
    position: 'absolute',
    backgroundColor: '#d4a843',
    opacity: 0.4,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d4a843',
    opacity: 0.9,
  },

  countLabel: {
    color: '#94a3b8',
    fontSize: 13,
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 24,
  },

  sectionLabel: {
    color: '#f8f6f0',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  chipsScroll: { flexGrow: 0 },
  chipsContent: { paddingHorizontal: 24, gap: 12, paddingBottom: 4 },
  chip: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  chipFlag: { fontSize: 32, marginBottom: 6 },
  chipName: { color: '#d4a843', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  chipCount: { color: '#f8f6f0', fontSize: 12 },
});
