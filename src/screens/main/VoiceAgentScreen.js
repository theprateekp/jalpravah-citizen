import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Easing, FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, getGuidance } from '../../services/VoiceAgent';

const SITUATIONS = [
  { id: 'trapped', label: 'Trapped in Flood', icon: '🆘' },
  { id: 'medical', label: 'Medical Emergency', icon: '🚑' },
  { id: 'evacuation', label: 'Need to Evacuate', icon: '🏃' },
  { id: 'food_water', label: 'Food / Water Shortage', icon: '💧' },
  { id: 'electricity', label: 'Electricity Hazard', icon: '⚡' },
  { id: 'rescue', label: 'Need Rescue', icon: '⛑️' },
];

export default function VoiceAgentScreen() {
  const { language, setLanguage, isOnline } = useApp();
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [guidance, setGuidance] = useState([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  };

  const stopPulse = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const startCall = (situation) => {
    setSelectedSituation(situation);
    const steps = getGuidance(situation.id, language);
    setGuidance(steps);
    setCurrentStep(0);
    setIsCallActive(true);
    startPulse();
  };

  const nextStep = () => {
    if (currentStep < guidance.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setSelectedSituation(null);
    setCurrentStep(0);
    stopPulse();
  };

  const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  if (isCallActive && selectedSituation) {
    return (
      <View style={styles.callContainer}>
        <LinearGradient colors={['#0D1B4B', '#1A1A2E']} style={StyleSheet.absoluteFill} />

        {/* Agent avatar */}
        <Animated.View style={[styles.agentAvatar, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.agentAvatarInner}>
            <Text style={styles.agentEmoji}>🤖</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.agentName}>Jal-Sahayak</Text>
        <Text style={styles.agentLang}>{selectedLang.nativeLabel} · {selectedSituation.icon} {selectedSituation.label}</Text>

        {/* Current guidance step */}
        <View style={styles.guidanceCard}>
          <Text style={styles.stepCounter}>Step {currentStep + 1} of {guidance.length}</Text>
          <Text style={styles.guidanceText}>{guidance[currentStep]}</Text>

          {/* Progress dots */}
          <View style={styles.stepDots}>
            {guidance.map((_, i) => (
              <View key={i} style={[styles.stepDot, i === currentStep && styles.stepDotActive, i < currentStep && styles.stepDotDone]} />
            ))}
          </View>
        </View>

        {/* Offline notice */}
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineBannerText}>📴 Offline — Text guidance mode active</Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.callControls}>
          {currentStep < guidance.length - 1 ? (
            <TouchableOpacity onPress={nextStep} style={styles.nextStepBtn}>
              <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.nextStepGradient}>
                <Text style={styles.nextStepText}>Next Step →</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.doneCard}>
              <Text style={styles.doneText}>✅ All steps completed. Stay safe.</Text>
            </View>
          )}
          <TouchableOpacity onPress={endCall} style={styles.endCallBtn}>
            <Text style={styles.endCallText}>End Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0D1B4B', '#1A1A2E']} style={styles.header}>
        <Text style={styles.title}>🤖 Jal-Sahayak</Text>
        <Text style={styles.subtitle}>AI Voice Support Agent · Step-by-step emergency guidance</Text>
        {!isOnline && (
          <View style={styles.offlinePill}>
            <Text style={styles.offlinePillText}>📴 Offline — Text mode</Text>
          </View>
        )}
      </LinearGradient>

      {/* Language selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Language</Text>
        <FlatList
          data={SUPPORTED_LANGUAGES}
          keyExtractor={l => l.code}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setLanguage(item.code)}
              style={[styles.langChip, language === item.code && styles.langChipActive]}
            >
              <Text style={[styles.langLabel, language === item.code && styles.langLabelActive]}>
                {item.nativeLabel}
              </Text>
              <Text style={styles.langSub}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Situation selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is your situation?</Text>
        <View style={styles.situationGrid}>
          {SITUATIONS.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => startCall(s)}
              style={styles.situationCard}
            >
              <LinearGradient colors={['#1A1A2E', '#0F3460']} style={styles.situationGradient}>
                <Text style={styles.situationIcon}>{s.icon}</Text>
                <Text style={styles.situationLabel}>{s.label}</Text>
                <Text style={styles.situationCta}>Get Guidance →</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* How it works */}
      <View style={[styles.section, { marginBottom: 48 }]}>
        <Text style={styles.sectionTitle}>How Jal-Sahayak Works</Text>
        {[
          { icon: '🌐', title: 'Online Mode', desc: 'Full AI voice call via Vapi.ai in your language with real-time guidance.' },
          { icon: '📴', title: 'Offline Mode', desc: 'Pre-loaded text scripts guide you step-by-step without internet.' },
          { icon: '🗣️', title: '10 Languages', desc: 'Hindi, English, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi.' },
          { icon: '📋', title: 'Situation-Based', desc: 'Factual, step-by-step instructions tailored to your exact emergency.' },
        ].map(h => (
          <View key={h.title} style={styles.howCard}>
            <Text style={styles.howIcon}>{h.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.howTitle}>{h.title}</Text>
              <Text style={styles.howDesc}>{h.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 24 },
  title: { ...Typography.h3, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  offlinePill: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(255,184,0,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  offlinePillText: { color: Colors.yellow, fontSize: 12, fontWeight: '600' },
  section: { padding: Spacing.xl, paddingBottom: 0 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },
  langChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.lg,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  langChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  langLabel: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  langLabelActive: { color: Colors.primaryDark },
  langSub: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  situationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  situationCard: { width: '47%', borderRadius: Radius.xl, overflow: 'hidden', elevation: 3 },
  situationGradient: { padding: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,201,167,0.2)', borderRadius: Radius.xl },
  situationIcon: { fontSize: 36, marginBottom: 8 },
  situationLabel: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  situationCta: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  howCard: {
    flexDirection: 'row', gap: 12, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: 14, marginBottom: 8, elevation: 1,
  },
  howIcon: { fontSize: 28 },
  howTitle: { ...Typography.bodyMedium, color: Colors.textPrimary },
  howDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 2, lineHeight: 18 },
  // Call active
  callContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  agentAvatar: { marginBottom: 16 },
  agentAvatarInner: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  agentEmoji: { fontSize: 52 },
  agentName: { ...Typography.h2, color: '#FFFFFF', marginBottom: 4 },
  agentLang: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 },
  guidanceCard: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl,
    padding: Spacing.xl, width: '100%', marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(0,201,167,0.3)',
  },
  stepCounter: { fontSize: 11, color: Colors.primary, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  guidanceText: { fontSize: 18, color: '#FFFFFF', lineHeight: 28, fontWeight: '500' },
  stepDots: { flexDirection: 'row', gap: 6, marginTop: 16 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepDotActive: { backgroundColor: Colors.primary, width: 20 },
  stepDotDone: { backgroundColor: 'rgba(0,201,167,0.4)' },
  offlineBanner: { backgroundColor: 'rgba(255,184,0,0.15)', borderRadius: Radius.lg, padding: 10, marginBottom: 16, width: '100%' },
  offlineBannerText: { color: Colors.yellow, fontSize: 13, textAlign: 'center', fontWeight: '600' },
  callControls: { width: '100%', gap: 12 },
  nextStepBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  nextStepGradient: { paddingVertical: 15, alignItems: 'center' },
  nextStepText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  doneCard: { backgroundColor: Colors.primaryLight, borderRadius: Radius.lg, padding: 16, alignItems: 'center' },
  doneText: { color: Colors.primaryDark, fontWeight: '700', fontSize: 15 },
  endCallBtn: { paddingVertical: 14, alignItems: 'center' },
  endCallText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
