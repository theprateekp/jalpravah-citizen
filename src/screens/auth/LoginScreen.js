import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Missing Info', 'Please enter your phone number and password.');
      return;
    }
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      setLoading(false);
      login({ name: 'Citizen User', phone, ward: 'K/E', role: 'citizen' });
      navigation.replace('MainTabs');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌊</Text>
          <Text style={styles.appName}>JalPravah</Text>
          <Text style={styles.subtitle}>Sign in to stay safe</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <View style={styles.countryCode}><Text style={styles.countryText}>🇮🇳 +91</Text></View>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, styles.inputFull]}
              placeholder="Enter password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.loginBtn}>
            <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.loginGradient}>
              <Text style={styles.loginText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* OTP option */}
          <TouchableOpacity style={styles.otpBtn}>
            <Text style={styles.otpText}>📱 Sign in with OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Sign up */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New to JalPravah? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Create Account →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
  logo: { fontSize: 48, marginBottom: 8 },
  appName: { ...Typography.h2, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', marginTop: 4, fontSize: 14 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.xl, shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 8,
  },
  cardTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.xl },
  inputGroup: { marginBottom: Spacing.lg },
  label: { ...Typography.captionMedium, color: Colors.textSecondary, marginBottom: 6 },
  inputRow: { flexDirection: 'row', gap: 8 },
  countryCode: {
    backgroundColor: Colors.background, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, justifyContent: 'center',
  },
  countryText: { fontSize: 14, color: Colors.textPrimary },
  input: {
    flex: 1, backgroundColor: Colors.background, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary,
  },
  inputFull: { flex: undefined, width: '100%' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: Spacing.lg },
  forgotText: { color: Colors.primary, fontSize: 13, fontWeight: '500' },
  loginBtn: { borderRadius: Radius.full, overflow: 'hidden', marginBottom: Spacing.lg },
  loginGradient: { paddingVertical: 15, alignItems: 'center' },
  loginText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.lg },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: 13 },
  otpBtn: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full,
    paddingVertical: 13, alignItems: 'center',
  },
  otpText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  signupText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  signupLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
