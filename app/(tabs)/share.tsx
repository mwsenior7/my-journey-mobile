import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

const SUPABASE_URL = 'https://hesfbleyhuzlsqdjbciu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LuEFLmPs0_HQX1tP3El2SQ_uMSG_uxg';
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const TTS_URL = 'https://www.myjourneytoamerica.com/api/tts';
const STORAGE_KEY = 'mjtoa_mobile_share_v2';
const STORAGE_VERSION = 2;
const TOTAL_QUESTIONS = 5;

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Hindi'];

const QUESTIONS = [
  "Where were you born, and what was life like there growing up?",
  "What made you decide to come to America? Was there a moment when you knew — or did the idea build up inside you over time?",
  "How did you make the journey here? Tell me about the travel itself — the route, the moments you remember, how you felt.",
  "What was your first day in America like? What did you see, hear, or feel that you've never forgotten?",
  "How has your life changed since arriving? Looking back, what are you most proud of?",
];

type Mode = 'ai' | 'write' | null;
type Phase = 'setup' | 'questions' | 'generating' | 'review' | 'saved';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export default function ShareScreen() {
  const [mode, setMode] = useState<Mode>(null);

  // AI interview state
  const [phase, setPhase] = useState<Phase>('setup');
  const [language, setLanguage] = useState('English');
  const [interviewName, setInterviewName] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(TOTAL_QUESTIONS).fill(''));
  const [generatedStory, setGeneratedStory] = useState('');
  const [saving, setSaving] = useState(false);

  // TTS state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  // Write myself state
  const [storyText, setStoryText] = useState('');
  const [writeName, setWriteName] = useState('');
  const [country, setCountry] = useState('');
  const [usState, setUsState] = useState('');
  const [year, setYear] = useState('');

  // Configure audio session on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    }).catch(() => {});
  }, []);

  // Load draft on mount; clear if shape doesn't match current 5-question version
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const draft = JSON.parse(raw);
        if (
          draft.version !== STORAGE_VERSION ||
          !Array.isArray(draft.answers) ||
          draft.answers.length !== TOTAL_QUESTIONS
        ) {
          AsyncStorage.removeItem(STORAGE_KEY);
          return;
        }
        setAnswers(draft.answers);
        setCurrentQ(Math.min(draft.currentQ ?? 0, TOTAL_QUESTIONS - 1));
        setInterviewName(draft.interviewName ?? '');
        setLanguage(draft.language ?? 'English');
      } catch {
        AsyncStorage.removeItem(STORAGE_KEY);
      }
    }).catch(() => {});
  }, []);

  const stopAndUnloadSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {
        // ignore cleanup errors
      }
      soundRef.current = null;
    }
  }, []);

  // Stop audio when navigating away from this tab
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAndUnloadSound();
      };
    }, [stopAndUnloadSound])
  );

  const fetchAndPlay = useCallback(async (text: string) => {
    await stopAndUnloadSound();
    setTtsLoading(true);
    try {
      const res = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const arrayBuffer = await res.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      const tempUri = (FileSystem.cacheDirectory ?? '') + 'tts_question.mp3';
      await FileSystem.writeAsStringAsync(tempUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const { sound } = await Audio.Sound.createAsync({ uri: tempUri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch {
      // TTS failure is non-fatal
    } finally {
      setTtsLoading(false);
    }
  }, [stopAndUnloadSound]);

  // Auto-play TTS when entering questions phase or moving to a new question
  useEffect(() => {
    if (phase === 'questions') {
      fetchAndPlay(QUESTIONS[currentQ]);
    }
  }, [phase, currentQ, fetchAndPlay]);

  const saveDraft = useCallback((
    newAnswers: string[],
    newQ: number,
    newName: string,
    newLang: string,
  ) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      answers: newAnswers,
      currentQ: newQ,
      interviewName: newName,
      language: newLang,
    })).catch(() => {});
  }, []);

  const resetInterview = () => {
    stopAndUnloadSound();
    setPhase('setup');
    setCurrentQ(0);
    const empty = Array(TOTAL_QUESTIONS).fill('');
    setAnswers(empty);
    setGeneratedStory('');
    setInterviewName('');
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  const updateAnswer = (text: string) => {
    const next = [...answers];
    next[currentQ] = text;
    setAnswers(next);
    saveDraft(next, currentQ, interviewName, language);
  };

  const goToQuestion = (nextQ: number) => {
    saveDraft(answers, nextQ, interviewName, language);
    setCurrentQ(nextQ);
  };

  const handleGenerate = async () => {
    await stopAndUnloadSound();
    setPhase('generating');
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
          model: 'claude-sonnet-4-6',
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
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      setPhase('saved');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save story.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitWrite = async () => {
    if (!storyText.trim() || !writeName.trim()) {
      Alert.alert('Required Fields', 'Please enter your name and story before submitting.');
      return;
    }
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
          name: writeName.trim(),
          story_text: storyText.trim(),
          country_of_origin: country.trim() || null,
          us_state: usState.trim() || null,
          year: year ? Number(year) : null,
        }),
      });
      if (!res.ok) throw new Error(`Save failed: ${await res.text()}`);
      Alert.alert('Thank You', 'Your story has been added to the archive.');
      setStoryText(''); setWriteName(''); setCountry(''); setUsState(''); setYear('');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to submit story.');
    } finally {
      setSaving(false);
    }
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
          onChangeText={text => {
            setInterviewName(text);
            saveDraft(answers, currentQ, text, language);
          }}
        />
        <Text style={styles.sectionLabel}>Interview language</Text>
        <View style={styles.languageRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.langChip, language === lang && styles.langChipActive]}
              activeOpacity={0.75}
              onPress={() => {
                setLanguage(lang);
                saveDraft(answers, currentQ, interviewName, lang);
              }}
            >
              <Text style={[styles.langChipText, language === lang && styles.langChipTextActive]}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.aiHint}>
          Our AI will guide you through {TOTAL_QUESTIONS} questions about your journey. Your answers will be woven into a written story.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => setPhase('questions')}>
          <Text style={styles.primaryBtnText}>Start Interview</Text>
        </TouchableOpacity>
      </View>
    );

    if (phase === 'questions') {
      const isLast = currentQ === TOTAL_QUESTIONS - 1;
      return (
        <View style={styles.section}>
          <Text style={styles.progressLabel}>Question {currentQ + 1} of {TOTAL_QUESTIONS}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentQ + 1) / TOTAL_QUESTIONS) * 100}%` as any }]} />
          </View>

          <Text style={styles.questionText}>{QUESTIONS[currentQ]}</Text>

          <TouchableOpacity
            style={[styles.replayBtn, ttsLoading && styles.replayBtnDisabled]}
            activeOpacity={0.75}
            onPress={() => fetchAndPlay(QUESTIONS[currentQ])}
            disabled={ttsLoading}
          >
            {ttsLoading ? (
              <ActivityIndicator size="small" color="#d4a843" />
            ) : (
              <Text style={styles.replayBtnText}>🔊 Replay Question</Text>
            )}
          </TouchableOpacity>

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
              <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8} onPress={() => goToQuestion(currentQ - 1)}>
                <Text style={styles.outlineBtnText}>← Previous</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 2 }]}
              activeOpacity={0.85}
              onPress={isLast ? handleGenerate : () => goToQuestion(currentQ + 1)}
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
          <Text style={styles.modeBtnFilledDesc}>Answer {TOTAL_QUESTIONS} guided questions with AI assistance</Text>
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
          <TouchableOpacity
            style={[styles.primaryBtn, saving && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={handleSubmitWrite}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="#0f172a" />
              : <Text style={styles.primaryBtnText}>Submit Story</Text>}
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

  questionText: { color: '#ffffff', fontSize: 17, fontWeight: '600', lineHeight: 26, marginBottom: 12 },

  replayBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#d4a843',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 20,
    minWidth: 44,
    alignItems: 'center',
  },
  replayBtnDisabled: { opacity: 0.5 },
  replayBtnText: { color: '#d4a843', fontSize: 13, fontWeight: '600' },

  answerInput: {
    backgroundColor: '#1e293b',
    color: '#f8f6f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 180,
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
