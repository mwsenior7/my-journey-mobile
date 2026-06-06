import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const FILTERS = [
  'All',
  'Latin America',
  'South Asia',
  'Middle East & Africa',
  'Europe',
  'East & Southeast Asia',
  'Caribbean',
];

type Story = {
  id: string;
  name: string;
  country_of_origin: string;
  us_state: string;
  year: number | null;
  story_text: string;
  region?: string;
};

export default function BrowseScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const url = `${SUPABASE_URL}/rest/v1/stories?select=*&order=created_at.desc`;
        console.log('Fetching stories from:', url);
        const res = await fetch(url, {
          headers: {
            'apikey': SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: Story[] = await res.json();
        setStories(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load stories.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const filtered = stories.filter((s) => {
    const matchesFilter = activeFilter === 'All' || s.region === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      q === '' ||
      (s.name ?? '').toLowerCase().includes(q) ||
      (s.country_of_origin ?? '').toLowerCase().includes(q) ||
      (s.us_state ?? '').toLowerCase().includes(q) ||
      (s.story_text ?? '').toLowerCase().includes(q);
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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#d4a843" />
          <Text style={styles.loadingText}>Loading stories...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>No stories match your search.</Text>
          )}
          {filtered.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text style={styles.cardName}>{s.name}</Text>
              <Text style={styles.cardCountry}>{s.country_of_origin}</Text>
              <Text style={styles.cardMeta}>
                {[s.us_state, s.year].filter(Boolean).join(' · ')}
              </Text>
              <Text style={styles.cardExcerpt} numberOfLines={3}>{s.story_text}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 15 },
  errorText: { color: '#f87171', fontSize: 15, textAlign: 'center', paddingHorizontal: 24 },

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
