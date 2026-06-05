import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const FILTERS = [
  'All',
  'Latin America',
  'South Asia',
  'Middle East & Africa',
  'Europe',
  'East & Southeast Asia',
  'Caribbean',
];

const STORIES = [
  {
    name: 'Ana Martinez',
    flag: '🇲🇽',
    country: 'Mexico',
    state: 'New York',
    year: 2004,
    region: 'Latin America',
    excerpt: 'She crossed the border with nothing but a phone number scrawled on a piece of paper and the hope that someone would answer.',
  },
  {
    name: 'Kwame Mensah',
    flag: '🇬🇭',
    country: 'Ghana',
    state: 'Minnesota',
    year: 2011,
    region: 'Middle East & Africa',
    excerpt: 'After three years of visa rejections, the fourth application finally came through on a Tuesday morning that changed everything.',
  },
  {
    name: 'Priya Nair',
    flag: '🇮🇳',
    country: 'India',
    state: 'California',
    year: 2008,
    region: 'South Asia',
    excerpt: 'She arrived with two suitcases, a computer science degree, and a job offer that turned into a 20-year career in Silicon Valley.',
  },
  {
    name: 'Fatima Al-Rashid',
    flag: '🇸🇾',
    country: 'Syria',
    state: 'Michigan',
    year: 2016,
    region: 'Middle East & Africa',
    excerpt: 'The refugee camp was supposed to be temporary. Three years later, a resettlement call came and the family of five packed what little remained.',
  },
  {
    name: 'Carlos Reyes',
    flag: '🇸🇻',
    country: 'El Salvador',
    state: 'Texas',
    year: 1999,
    region: 'Latin America',
    excerpt: 'He left during the civil war\'s aftermath and built a construction business that now employs forty people, half of them his own relatives.',
  },
  {
    name: 'Mei-Lin Chen',
    flag: '🇹🇼',
    country: 'Taiwan',
    state: 'Washington',
    year: 2001,
    region: 'East & Southeast Asia',
    excerpt: 'A scholarship to study marine biology brought her to Seattle. She never left, drawn by the grey skies that reminded her of home.',
  },
  {
    name: 'Olena Kovalenko',
    flag: '🇺🇦',
    country: 'Ukraine',
    state: 'Illinois',
    year: 2022,
    region: 'Europe',
    excerpt: 'She fled Kyiv with her daughter in February, carrying school reports and a photo album. Her husband stayed behind.',
  },
  {
    name: 'Jean-Pierre Dubois',
    flag: '🇭🇹',
    country: 'Haiti',
    state: 'Florida',
    year: 2010,
    region: 'Caribbean',
    excerpt: 'The earthquake took the house his grandfather built. He rebuilt in Miami, and sends money home every month without fail.',
  },
];

export default function BrowseScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = STORIES.filter((s) => {
    const matchesFilter = activeFilter === 'All' || s.region === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      q === '' ||
      s.name.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.excerpt.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Browse Stories</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search stories..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => {
          const active = f === activeFilter;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, active && styles.filterChipActive]}
              activeOpacity={0.75}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No stories match your search.</Text>
        )}
        {filtered.map((s) => (
          <View key={s.name} style={styles.card}>
            <Text style={styles.cardName}>{s.name}</Text>
            <Text style={styles.cardCountry}>{s.flag} {s.country}</Text>
            <Text style={styles.cardMeta}>{s.state} · {s.year}</Text>
            <Text style={styles.cardExcerpt}>{s.excerpt}</Text>
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
    marginBottom: 0,
  },

  searchBar: {
    backgroundColor: '#1e293b',
    color: '#f8f6f0',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 24,
    marginTop: 16,
    fontSize: 15,
  },

  filterScroll: { marginTop: 16, flexGrow: 0 },
  filterContent: { paddingHorizontal: 24, paddingBottom: 4 },
  filterChip: {
    borderWidth: 1.5,
    borderColor: '#64748b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipActive: { borderColor: '#d4a843' },
  filterText: { color: '#f8f6f0', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#d4a843', fontWeight: '700' },

  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },

  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40, fontSize: 15 },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardName: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardCountry: { color: '#d4a843', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  cardMeta: { color: '#f8f6f0', fontSize: 12, marginBottom: 8 },
  cardExcerpt: { color: 'rgba(248,246,240,0.8)', fontSize: 14, lineHeight: 22 },
});
