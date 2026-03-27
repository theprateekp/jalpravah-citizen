import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { WARDS } from '../../data/wardData';

export default function RegisterScreen({ navigation }) {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [ward, setWard] = useState('K/E');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name || !phone || !password) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // login() updates user state → RootNavigator auto-switches to AppStack
      login({ name, phone, ward, role: 'citizen' });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>🌊</Text>
            <Text style={styles.appName}>JalPravah</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get Started</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

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
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Ward (Mumbai)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wardScroll}>
                {WARDS.slice(0, 8).map(w => (
                  <TouchableOpacity
                    key={w.code}
                    onPress={() => setWard(w.code)}
                    style={[styles.wardChip, ward === w.code && styles.wardChipActive]}
                  >
                    <Text style={[styles.wardChipText, ward === w.code && styles.wardChipTextActive]}>
                      {w.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.btn}>
              <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.btnGradient}>
                <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: 48 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
  logo: { fontSize: 48, marginBottom: 8 },
  appName: { ...Typography.h2, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', marginTop: 4, fontSize: 14 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.xl, elevation: 8,
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
  wardScroll: { marginTop: 4 },
  wardChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full,
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
    marginRight: 8,
  },
  wardChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  wardChipText: { fontSize: 13, color: Colors.textSecondary },
  wardChipTextActive: { color: Colors.primaryDark, fontWeight: '600' },
  btn: { borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.sm },
  btnGradient: { paddingVertical: 15, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  loginText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  loginLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
