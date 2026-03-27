import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🌊</Text>
        </View>

        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.appName}>JalPravah</Text>
          <Text style={styles.tagline}>Citizen Safety Platform</Text>
        </Animated.View>

        <View style={styles.dotsRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>
      </Animated.View>

      <Text style={styles.poweredBy}>Powered by ISRO Bhuvan · Open-Meteo · Vapi AI</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { position: 'absolute', borderRadius: 999, opacity: 0.08 },
  circle1: { width: 300, height: 300, backgroundColor: Colors.primary, top: -80, right: -80 },
  circle2: { width: 200, height: 200, backgroundColor: Colors.accent, bottom: 100, left: -60 },
  circle3: { width: 150, height: 150, backgroundColor: Colors.primary, bottom: -40, right: 40 },
  content: { alignItems: 'center' },
  logoContainer: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: 'rgba(0,201,167,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(0,201,167,0.4)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  logoEmoji: { fontSize: 48 },
  appName: { ...Typography.h1, color: '#FFFFFF', textAlign: 'center', fontSize: 40 },
  tagline: { ...Typography.body, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 6 },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: Colors.primary, width: 24 },
  poweredBy: { position: 'absolute', bottom: 40, fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
});
