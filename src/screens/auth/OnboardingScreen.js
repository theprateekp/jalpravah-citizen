import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1', emoji: '🗺️',
    title: 'Real-Time Flood Map',
    desc: 'See live flood risk for your area with color-coded zones. Know your Pre-Monsoon Readiness Score instantly.',
    gradient: ['#1A1A2E', '#0F3460'],
    accent: '#00C9A7',
  },
  {
    id: '2', emoji: '🆘',
    title: 'One-Tap SOS',
    desc: 'Trapped? Send your exact location, medical info, and emergency type to rescue teams in seconds.',
    gradient: ['#1A1A2E', '#3D0C11'],
    accent: '#FF3B5C',
  },
  {
    id: '3', emoji: '🤖',
    title: 'AI Voice Assistant',
    desc: 'Jal-Sahayak speaks your language. Get real-time guidance in Hindi, Marathi, English and more.',
    gradient: ['#1A1A2E', '#0D1B4B'],
    accent: '#6C63FF',
  },
  {
    id: '4', emoji: '📍',
    title: 'Safe Spots & Helplines',
    desc: 'Find the nearest shelter, hospital, or relief camp. One tap to call any emergency department.',
    gradient: ['#1A1A2E', '#0A2E1A'],
    accent: '#FFB800',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item }) => (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      <View style={[styles.circle, { backgroundColor: item.accent }]} />
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={i => i.id}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          {activeIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
            <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.nextGradient}>
              <Text style={styles.nextText}>
                {activeIndex === SLIDES.length - 1 ? 'Get Started →' : 'Next →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  slide: { width, height, alignItems: 'center', justifyContent: 'center', padding: 40 },
  circle: { position: 'absolute', width: 280, height: 280, borderRadius: 140, opacity: 0.08, top: -60, right: -60 },
  emojiContainer: {
    width: 120, height: 120, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40,
  },
  emoji: { fontSize: 60 },
  title: { ...Typography.h2, color: '#FFFFFF', textAlign: 'center', marginBottom: 16 },
  desc: { ...Typography.body, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 24 },
  controls: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32, paddingBottom: 48 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12 },
  skipBtn: { padding: 14 },
  skipText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  nextBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  nextGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  nextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
