import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const SUPABASE_URL = 'https://hesfbleyhuzlsqdjbciu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LuEFLmPs0_HQX1tP3El2SQ_uMSG_uxg';

type Story = {
  id: string;
  name: string;
  country_of_origin: string;
  story_text: string;
};

type Stats = {
  stories: string;
  countries: string;
  states: string;
};

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

export default function HomeScreen() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({ stories: '—', countries: '—', states: '—' });
  const [featured, setFeatured] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, statsRes] = await Promise.all([
          fetch(
            `${SUPABASE_URL}/rest/v1/stories?select=id,name,country_of_origin,story_text&order=created_at.desc&limit=3`,
            { headers: HEADERS }
          ),
          fetch(
            `${SUPABASE_URL}/rest/v1/stories?select=country_of_origin,us_state`,
            { headers: { ...HEADERS, Prefer: 'count=exact' } }
          ),
        ]);

        if (featuredRes.ok) {
          const data: Story[] = await featuredRes.json();
          setFeatured(data);
        }

        if (statsRes.ok) {
          const contentRange = statsRes.headers.get('content-range');
          const total = contentRange ? contentRange.split('/')[1] : null;
          const rows: { country_of_origin: string | null; us_state: string | null }[] =
            await statsRes.json();

          const countries = new Set(rows.map((r) => r.country_of_origin).filter(Boolean)).size;
          const states = new Set(rows.map((r) => r.us_state).filter(Boolean)).size;

          setStats({
            stories: total ? Number(total).toLocaleString() : rows.length.toLocaleString(),
            countries: countries > 0 ? String(countries) : '—',
            states: states > 0 ? String(states) : '—',
          });
        }
      } catch {
        // Keep default dashes on error
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statItems = [
    { label: 'Stories archived', value: stats.stories },
    { label: 'Countries represented', value: stats.countries },
    { label: 'US states covered', value: stats.states },
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
          <TouchableOpacity style={styles.filledButton} activeOpacity={0.85} onPress={() => router.push('/(tabs)/browse')}>
            <Text style={styles.filledButtonText}>Browse Stories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => router.push('/(tabs)/share')}>
            <Text style={styles.outlineButtonText}>Share Your Story</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        {statItems.map((s) => (
          <View key={s.label} style={styles.statItem}>
            {loading
              ? <ActivityIndicator size="small" color="#d4a843" />
              : <Text style={styles.statValue}>{s.value}</Text>}
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionHeading}>Featured Stories</Text>
      <View style={styles.cardsContainer}>
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#d4a843" />
          </View>
        ) : featured.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardExcerpt}>No stories yet — be the first to share yours.</Text>
          </View>
        ) : (
          featured.map((f) => (
            <View key={f.id} style={styles.card}>
              <Text style={styles.cardTitle}>{f.name}</Text>
              <Text style={styles.cardMeta}>{f.country_of_origin}</Text>
              <Text style={styles.cardExcerpt} numberOfLines={3}>
                {f.story_text}
              </Text>
            </View>
          ))
        )}
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

  heroButtons: { flexDirection: 'row', marginBottom: 60 },
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
    minHeight: 60,
    alignItems: 'center',
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
  loadingCard: { backgroundColor: '#1e293b', borderRadius: 10, padding: 24, alignItems: 'center' },
  card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#f8f6f0', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  cardExcerpt: { color: '#f8f6f0', fontSize: 14, marginTop: 8, lineHeight: 22 },
});
