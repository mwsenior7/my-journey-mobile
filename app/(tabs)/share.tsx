import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

type Mode = 'ai' | 'write' | null;

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Hindi'];

export default function ShareScreen() {
  const [mode, setMode] = useState<Mode>(null);
  const [language, setLanguage] = useState('English');

  const [storyText, setStoryText] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [year, setYear] = useState('');

  const handleStartInterview = () => {
    Alert.alert('Coming Soon', 'AI-guided interviews will be available in the next update.');
  };

  const handleSubmit = () => {
    if (!storyText.trim() || !name.trim()) {
      Alert.alert('Required Fields', 'Please enter your name and story before submitting.');
      return;
    }
    Alert.alert('Thank You', 'Your story has been submitted for review.');
    setStoryText('');
    setName('');
    setCountry('');
    setState('');
    setYear('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Share Your Story</Text>
      <Text style={styles.subheader}>Every journey deserves to be heard. Choose how you'd like to share yours.</Text>

      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeButton, styles.modeButtonFilled, mode === 'ai' && styles.modeButtonSelected]}
          activeOpacity={0.85}
          onPress={() => setMode('ai')}
        >
          <Text style={styles.modeButtonFilledTitle}>AI Interview</Text>
          <Text style={styles.modeButtonFilledDesc}>Answer 8 guided questions with AI assistance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, styles.modeButtonOutline, mode === 'write' && styles.modeButtonOutlineSelected]}
          activeOpacity={0.85}
          onPress={() => setMode('write')}
        >
          <Text style={[styles.modeButtonOutlineTitle, mode === 'write' && styles.modeButtonOutlineTitleSelected]}>Write Myself</Text>
          <Text style={[styles.modeButtonOutlineDesc, mode === 'write' && styles.modeButtonOutlineDescSelected]}>Write your story in your own words</Text>
        </TouchableOpacity>
      </View>

      {mode === 'ai' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Choose your language</Text>
          <View style={styles.languageRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langChip, language === lang && styles.langChipActive]}
                activeOpacity={0.75}
                onPress={() => setLanguage(lang)}
              >
                <Text style={[styles.langChipText, language === lang && styles.langChipTextActive]}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.aiHint}>Our AI will guide you through 8 questions about your journey. Your answers will be woven into a written story.</Text>
          <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleStartInterview}>
            <Text style={styles.submitButtonText}>Start Interview</Text>
          </TouchableOpacity>
        </View>
      )}

      {mode === 'write' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your story</Text>
          <TextInput
            style={styles.storyInput}
            placeholder="Write your immigration story here..."
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            value={storyText}
            onChangeText={setStoryText}
          />

          <Text style={styles.sectionLabel}>About you</Text>

          <TextInput
            style={styles.fieldInput}
            placeholder="Full name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.fieldInput}
            placeholder="Country of origin"
            placeholderTextColor="#64748b"
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={styles.fieldInput}
            placeholder="US state you settled in"
            placeholderTextColor="#64748b"
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={styles.fieldInput}
            placeholder="Year you arrived"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            value={year}
            onChangeText={setYear}
          />

          <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Story</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 60 },

  header: {
    color: '#d4a843',
    fontSize: 28,
    fontWeight: '700',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  subheader: {
    color: '#94a3b8',
    fontSize: 14,
    paddingHorizontal: 24,
    marginBottom: 28,
    lineHeight: 22,
  },

  modeRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12 },

  modeButton: { flex: 1, borderRadius: 12, padding: 16 },

  modeButtonFilled: { backgroundColor: '#d4a843' },
  modeButtonSelected: { opacity: 1 },
  modeButtonFilledTitle: { color: '#0f172a', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  modeButtonFilledDesc: { color: '#0f172a', fontSize: 12, lineHeight: 18, opacity: 0.75 },

  modeButtonOutline: { borderWidth: 2, borderColor: '#475569' },
  modeButtonOutlineSelected: { borderColor: '#d4a843' },
  modeButtonOutlineTitle: { color: '#64748b', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  modeButtonOutlineTitleSelected: { color: '#d4a843' },
  modeButtonOutlineDesc: { color: '#64748b', fontSize: 12, lineHeight: 18 },
  modeButtonOutlineDescSelected: { color: '#94a3b8' },

  section: { paddingHorizontal: 24, marginTop: 28 },

  sectionLabel: {
    color: '#f8f6f0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },

  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  langChip: {
    borderWidth: 1.5,
    borderColor: '#475569',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  langChipActive: { borderColor: '#d4a843' },
  langChipText: { color: '#f8f6f0', fontSize: 13 },
  langChipTextActive: { color: '#d4a843', fontWeight: '700' },

  aiHint: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },

  storyInput: {
    backgroundColor: '#1e293b',
    color: '#f8f6f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 200,
    marginBottom: 24,
    lineHeight: 24,
  },

  fieldInput: {
    backgroundColor: '#1e293b',
    color: '#f8f6f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },

  submitButton: {
    backgroundColor: '#d4a843',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
});
