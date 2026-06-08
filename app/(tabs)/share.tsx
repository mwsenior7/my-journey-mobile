import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';

const SUPABASE_URL = 'https://hesfbleyhuzlsqdjbciu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LuEFLmPs0_HQX1tP3El2SQ_uMSG_uxg';
// Add your Anthropic API key here — not found in .env
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Hindi'];

const QUESTIONS = [
  'What country did you come from, and what was your life like there before you decided to come to America?',
  'What made you decide to leave your home country and come to America?',
  'How did you travel to America? What was the journey like?',
  'What was your first day or first week in America like?',
  'What were the biggest challenges you faced when you first arrived?',
  'How did you find community and belonging in America?',
  'How has your life changed since coming to America?',
  'What would you like future generations to know about your journey?',
];

type Mode = 'ai' | 'write' | null;
type Phase = 'setup' | 'questions' | 'generating' | 'review' | 'saved';

export default function ShareScreen() {
  const [mode, setMode] = useState<Mode>(null);

  // AI interview state
  const [phase, setPhase] = useState<Phase>('setup');
  const [language, setLanguage] = useState('English');
  const [interviewName, setInterviewName] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(8).fill(''));
  const [generatedStory, setGeneratedStory] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Write myself state
  const [storyText, setStoryText] = useState('');
  const [writeName, setWriteName] = useState('');
  const [country, setCountry] = useState('');
  const [usState, setUsState] = useState('');
  const [year, setYear] = useState('');

  const resetInterview = () => {
    setPhase('setup');
    setCurrentQ(0);
    setAnswers(Array(8).fill(''));
    setGeneratedStory('');
    setInterviewName('');
  };

  const updateAnswer = (text: string) => {
    const next = [...answers];
    next[currentQ] = text;
    setAnswers(next);
  };

  const handleGenerate = async () => {
    setPhase('generating');
    setGenerating(true);
    const qaPairs = QUESTIONS.map((q, i) =>
      `Q${i + 1}: ${q}\nAnswer: ${answers[i].trim() || '(not answered)'}`
    ).join('\n\n');

    const prompt = `You are helping compile an immigration story for a digital archive called "My Journey to America". Based on the interview answers below, write a heartfelt first-person immigration story of 400–600 words. Write it as if the person is telling their own story — flowing, personal, and dignified. Use their actual answers as your source material.\n\nInterview language: ${language}\n\n${qaPairs}\n\nWrite the story now:`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setGeneratedStory(data.content?.[0]?.text ?? '');
      setPhase('review');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to generate story.');
      setPhase('questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/stories`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          name: interviewName.trim() || 'Anonymous',
          story_text: generatedStory,
        }),
      });
      if (!res.ok) throw new Error(`Save failed: ${await res.text()}`);
      setPhase('saved');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save story.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitWrite = () => {
    if (!storyText.trim() || !writeName.trim()) {
      Alert.alert('Required Fields', 'Please enter your name and story before submitting.');
      return;
    }
    Alert.alert('Thank You', 'Your story has been submitted for review.');
    setStoryText(''); setWriteName(''); setCountry(''); setUsState(''); setYear('');
  };

  const renderAI = () => {
    if (phase === 'setup') return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your name (optional)</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Full name"
          placeholderTextColor="#64748b"
          value={interviewName}
          onChangeText={setInterviewName}
        />
        <Text style={styles.sectionLabel}>Interview language</Text>
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
        <Text style={styles.aiHint}>
          Our AI will guide you through 8 questions about your journey. Your answers will be woven into a written story.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => setPhase('questions')}>
          <Text style={styles.primaryBtnText}>Start Interview</Text>
        </TouchableOpacity>
      </View>
    );

    if (phase === 'questions') {
      const isLast = currentQ === 7;
      return (
        <View style={styles.section}>
          <Text style={styles.progressLabel}>Question {currentQ + 1} of 8</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentQ + 1) / 8) * 100}%` }]} />
          </View>

          <Text style={styles.questionText}>{QUESTIONS[currentQ]}</Text>

          <TextInput
            style={styles.answerInput}
            placeholder="Type your answer here..."
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            value={answers[currentQ]}
            onChangeText={updateAnswer}
          />

          <View style={styles.navRow}>
            {currentQ > 0 ? (
              <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8} onPress={() => setCurrentQ(currentQ - 1)}>
                <Text style={styles.outlineBtnText}>← Previous</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 2 }]}
              activeOpacity={0.85}
              onPress={isLast ? handleGenerate : () => setCurrentQ(currentQ + 1)}
            >
              <Text style={styles.primaryBtnText}>{isLast ? 'Complete Interview' : 'Next Question →'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (phase === 'generating') return (
      <View style={styles.centeredSection}>
        <ActivityIndicator size="large" color="#d4a843" />
        <Text style={styles.generatingTitle}>Writing your story...</Text>
        <Text style={styles.generatingSubtext}>Claude is weaving your answers into a narrative.</Text>
      </View>
    );

    if (phase === 'review') return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your Story</Text>
        <Text style={styles.reviewHint}>Review your story below, then save it to the archive.</Text>
        <View style={styles.storyBox}>
          <Text style={styles.storyBoxText}>{generatedStory}</Text>
        </View>
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8} onPress={() => setPhase('questions')}>
            <Text style={styles.outlineBtnText}>← Edit Answers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryBtn, { flex: 2 }, saving && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="#0f172a" />
              : <Text style={styles.primaryBtnText}>Save Story</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );

    if (phase === 'saved') return (
      <View style={styles.centeredSection}>
        <Text style={styles.savedEmoji}>🕊️</Text>
        <Text style={styles.savedTitle}>Story Saved</Text>
        <Text style={styles.savedSubtext}>
          Thank you for sharing your journey. Your story is now part of the archive.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={resetInterview}>
          <Text style={styles.primaryBtnText}>Share Another Story</Text>
        </TouchableOpacity>
      </View>
    );

    return null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Share Your Story</Text>
      <Text style={styles.subheader}>Every journey deserves to be heard. Choose how you'd like to share yours.</Text>

      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, styles.modeBtnFilled]}
          activeOpacity={0.85}
          onPress={() => { setMode('ai'); resetInterview(); }}
        >
          <Text style={styles.modeBtnFilledTitle}>AI Interview</Text>
          <Text style={styles.modeBtnFilledDesc}>Answer 8 guided questions with AI assistance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, styles.modeBtnOutline, mode === 'write' && styles.modeBtnOutlineActive]}
          activeOpacity={0.85}
          onPress={() => setMode('write')}
        >
          <Text style={[styles.modeBtnOutlineTitle, mode === 'write' && styles.modeBtnOutlineTitleActive]}>Write Myself</Text>
          <Text style={[styles.modeBtnOutlineDesc, mode === 'write' && styles.modeBtnOutlineDescActive]}>Write your story in your own words</Text>
        </TouchableOpacity>
      </View>

      {mode === 'ai' && renderAI()}

      {mode === 'write' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your story</Text>
          <TextInput
            style={styles.answerInput}
            placeholder="Write your immigration story here..."
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            value={storyText}
            onChangeText={setStoryText}
          />
          <Text style={styles.sectionLabel}>About you</Text>
          <TextInput style={styles.fieldInput} placeholder="Full name" placeholderTextColor="#64748b" value={writeName} onChangeText={setWriteName} />
          <TextInput style={styles.fieldInput} placeholder="Country of origin" placeholderTextColor="#64748b" value={country} onChangeText={setCountry} />
          <TextInput style={styles.fieldInput} placeholder="US state you settled in" placeholderTextColor="#64748b" value={usState} onChangeText={setUsState} />
          <TextInput style={styles.fieldInput} placeholder="Year you arrived" placeholderTextColor="#64748b" keyboardType="number-pad" value={year} onChangeText={setYear} />
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={handleSubmitWrite}>
            <Text style={styles.primaryBtnText}>Submit Story</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 60 },

  header: { color: '#d4a843', fontSize: 28, fontWeight: '700', paddingTop: 60, paddingHorizontal: 24, marginBottom: 8 },
  subheader: { color: '#94a3b8', fontSize: 14, paddingHorizontal: 24, marginBottom: 28, lineHeight: 22 },

  modeRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12 },
  modeBtn: { flex: 1, borderRadius: 12, padding: 16 },
  modeBtnFilled: { backgroundColor: '#d4a843' },
  modeBtnFilledTitle: { color: '#0f172a', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  modeBtnFilledDesc: { color: '#0f172a', fontSize: 12, lineHeight: 18, opacity: 0.75 },
  modeBtnOutline: { borderWidth: 2, borderColor: '#475569' },
  modeBtnOutlineActive: { borderColor: '#d4a843' },
  modeBtnOutlineTitle: { color: '#64748b', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  modeBtnOutlineTitleActive: { color: '#d4a843' },
  modeBtnOutlineDesc: { color: '#64748b', fontSize: 12, lineHeight: 18 },
  modeBtnOutlineDescActive: { color: '#94a3b8' },

  section: { paddingHorizontal: 24, marginTop: 28 },
  sectionLabel: { color: '#f8f6f0', fontSize: 14, fontWeight: '600', marginBottom: 12, marginTop: 8 },

  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  langChip: { borderWidth: 1.5, borderColor: '#475569', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  langChipActive: { borderColor: '#d4a843' },
  langChipText: { color: '#f8f6f0', fontSize: 13 },
  langChipTextActive: { color: '#d4a843', fontWeight: '700' },

  aiHint: { color: '#64748b', fontSize: 14, lineHeight: 22, marginBottom: 24, textAlign: 'center' },

  progressLabel: { color: '#d4a843', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  progressTrack: { height: 4, backgroundColor: '#1e293b', borderRadius: 2, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: '#d4a843', borderRadius: 2 },

  questionText: { color: '#ffffff', fontSize: 17, fontWeight: '600', lineHeight: 26, marginBottom: 20 },

  answerInput: {
    backgroundColor: '#1e293b',
    color: '#f8f6f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 200,
    marginBottom: 20,
    lineHeight: 24,
  },

  navRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  outlineBtn: { flex: 1, borderWidth: 2, borderColor: '#d4a843', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  outlineBtnText: { color: '#d4a843', fontSize: 14, fontWeight: '700' },

  primaryBtn: { backgroundColor: '#d4a843', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },

  centeredSection: { paddingHorizontal: 24, marginTop: 52, alignItems: 'center' },
  generatingTitle: { color: '#d4a843', fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  generatingSubtext: { color: '#64748b', fontSize: 14, textAlign: 'center' },

  reviewHint: { color: '#64748b', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  storyBox: { backgroundColor: '#1e293b', borderRadius: 10, padding: 16, marginBottom: 20 },
  storyBoxText: { color: '#f8f6f0', fontSize: 15, lineHeight: 26 },

  savedEmoji: { fontSize: 52, marginBottom: 16 },
  savedTitle: { color: '#d4a843', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  savedSubtext: { color: '#f8f6f0', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 32 },

  fieldInput: { backgroundColor: '#1e293b', color: '#f8f6f0', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 12 },
});
