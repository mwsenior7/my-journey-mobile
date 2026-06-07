import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOP_COUNTRIES = [
  { flag: '🇲🇽', name: 'Mexico', count: 142 },
  { flag: '🇮🇳', name: 'India', count: 118 },
  { flag: '🇨🇳', name: 'China', count: 97 },
  { flag: '🇵🇭', name: 'Philippines', count: 84 },
  { flag: '🇸🇻', name: 'El Salvador', count: 61 },
];

// Story origin dots: [cx, cy] as percentages of the SVG viewBox (0–100)
const STORY_DOTS = [
  // Mexico / Central America
  [19, 45], [17, 48], [20, 51],
  // Caribbean
  [24, 44],
  // South America
  [25, 60], [27, 65], [23, 68],
  // West Africa
  [46, 50], [49, 54],
  // East Africa
  [54, 55],
  // Middle East
  [57, 38], [60, 42],
  // South Asia
  [67, 42], [69, 46],
  // Southeast Asia
  [76, 50], [80, 53],
  // East Asia
  [77, 34], [73, 37],
  // Europe
  [48, 26], [52, 28], [55, 25],
  // Central / Eastern Europe
  [60, 28], [65, 26],
];

const dotsMarkup = STORY_DOTS.map(([cx, cy]) =>
  `<circle cx="${cx}%" cy="${cy}%" r="1.5%" fill="#d4a843" opacity="0.9"/>`
).join('\n    ');

const MAP_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; background: #1e293b; overflow: hidden; }
  svg { width: 100%; height: 100%; display: block; }
</style>
</head>
<body>
<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <!-- Ocean background -->
  <rect width="1000" height="500" fill="#1e293b"/>

  <!-- Continent fills — simplified outlines -->

  <!-- North America -->
  <path d="M120,60 L220,55 L260,80 L270,130 L240,160 L210,190 L180,220 L150,230 L130,200 L100,170 L90,130 L100,90 Z"
        fill="#d4a843" opacity="0.35"/>
  <!-- Greenland -->
  <ellipse cx="215" cy="35" rx="30" ry="22" fill="#d4a843" opacity="0.25"/>
  <!-- Central America -->
  <path d="M180,220 L210,190 L225,230 L210,250 L190,240 Z"
        fill="#d4a843" opacity="0.35"/>

  <!-- South America -->
  <path d="M200,260 L250,250 L280,270 L290,320 L275,380 L245,420 L215,410 L195,360 L185,300 Z"
        fill="#d4a843" opacity="0.35"/>

  <!-- Europe -->
  <path d="M430,70 L510,65 L530,90 L520,130 L490,145 L460,140 L435,120 L420,95 Z"
        fill="#d4a843" opacity="0.35"/>
  <!-- Scandinavia bump -->
  <path d="M460,50 L490,45 L500,70 L470,75 Z"
        fill="#d4a843" opacity="0.3"/>

  <!-- Africa -->
  <path d="M440,160 L510,155 L545,175 L560,220 L555,290 L530,360 L500,390 L470,375 L445,320 L430,250 L435,200 Z"
        fill="#d4a843" opacity="0.35"/>

  <!-- Middle East / Arabian peninsula -->
  <path d="M530,160 L580,155 L600,190 L580,230 L550,225 L530,200 Z"
        fill="#d4a843" opacity="0.3"/>

  <!-- Asia (main body) -->
  <path d="M560,60 L750,50 L820,70 L850,110 L840,170 L780,200 L700,210 L630,200 L580,180 L555,140 L550,95 Z"
        fill="#d4a843" opacity="0.35"/>
  <!-- Indian subcontinent -->
  <path d="M630,200 L700,210 L710,260 L680,300 L655,295 L635,250 Z"
        fill="#d4a843" opacity="0.35"/>
  <!-- Southeast Asia peninsula -->
  <path d="M740,210 L780,200 L790,250 L770,280 L745,265 Z"
        fill="#d4a843" opacity="0.3"/>
  <!-- Japan -->
  <ellipse cx="840" cy="145" rx="12" ry="25" fill="#d4a843" opacity="0.3"/>

  <!-- Australia -->
  <path d="M760,330 L850,325 L870,360 L855,400 L810,415 L765,395 L748,365 Z"
        fill="#d4a843" opacity="0.35"/>
  <!-- New Zealand -->
  <ellipse cx="900" cy="390" rx="10" ry="20" fill="#d4a843" opacity="0.25"/>

  <!-- UK / Ireland -->
  <ellipse cx="428" cy="82" rx="8" ry="13" fill="#d4a843" opacity="0.3"/>

  <!-- Story origin dots -->
  ${dotsMarkup}
</svg>
</body>
</html>`;

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journey Map</Text>
      <Text style={styles.subheader}>Stories from around the world</Text>

      <WebView
        style={styles.map}
        source={{ html: MAP_HTML }}
        scrollEnabled={false}
        originWhitelist={['*']}
      />

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
    marginBottom: 16,
  },

  map: {
    width: SCREEN_WIDTH,
    height: 350,
    backgroundColor: '#1e293b',
  },

  countLabel: {
    color: '#94a3b8',
    fontSize: 13,
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
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
