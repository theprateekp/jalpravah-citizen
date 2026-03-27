import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Switch, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export default function TriageCardScreen() {
  const { triageData, saveTriage } = useApp();
  const [form, setForm] = useState({ ...triageData });
  const [saved, setSaved] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    await saveTriage(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    Alert.alert('Saved', 'Your triage card is saved. It will be sent automatically with any SOS.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1A1A2E', '#0D1B4B']} style={styles.header}>
        <Text style={styles.title}>🏥 Digital Triage Card</Text>
        <Text style={styles.subtitle}>Pre-fill your medical info — sent instantly with SOS</Text>
      </LinearGradient>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔒 This data is stored only on your device and shared only when you trigger an SOS.
        </Text>
      </View>

      <View style={styles.content}>
        {/* Blood Type */}
        <Text style={styles.label}>Blood Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {BLOOD_TYPES.map(bt => (
            <TouchableOpacity
              key={bt}
              onPress={() => update('bloodType', bt)}
              style={[styles.chip, form.bloodType === bt && styles.chipActive]}
            >
              <Text style={[styles.chipText, form.bloodType === bt && styles.chipTextActive]}>{bt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Diabetes */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.label}>Diabetic</Text>
            <Text style={styles.sublabel}>Requires insulin or blood sugar monitoring</Text>
          </View>
          <Switch
            value={form.diabetes}
            onValueChange={v => update('diabetes', v)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={form.diabetes ? Colors.primaryDark : '#f4f3f4'}
          />
        </View>

        {/* Allergies */}
        <Text style={styles.label}>Known Allergies</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Penicillin, Peanuts, Latex"
          placeholderTextColor={Colors.textMuted}
          value={form.allergies}
          onChangeText={v => update('allergies', v)}
        />

        {/* Medicines */}
        <Text style={styles.label}>Current Medicines</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
          placeholderTextColor={Colors.textMuted}
          value={form.medicines}
          onChangeText={v => update('medicines', v)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Disability */}
        <Text style={styles.label}>Disability / Mobility Needs</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Wheelchair user, Visual impairment"
          placeholderTextColor={Colors.textMuted}
          value={form.disability}
          onChangeText={v => update('disability', v)}
        />

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor={Colors.textMuted}
          value={form.emergencyContact}
          onChangeText={v => update('emergencyContact', v)}
        />

        <Text style={styles.label}>Emergency Contact Phone</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryCode}><Text style={styles.countryText}>🇮🇳 +91</Text></View>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
            value={form.emergencyContactPhone}
            onChangeText={v => update('emergencyContactPhone', v)}
            maxLength={10}
          />
        </View>

        {/* Preview Card */}
        {(form.bloodType || form.allergies || form.medicines) && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>📋 Triage Summary (sent with SOS)</Text>
            {form.bloodType ? <Text style={styles.previewRow}>🩸 Blood Type: {form.bloodType}</Text> : null}
            {form.diabetes ? <Text style={styles.previewRow}>💉 Diabetic: Yes</Text> : null}
            {form.allergies ? <Text style={styles.previewRow}>⚠️ Allergies: {form.allergies}</Text> : null}
            {form.medicines ? <Text style={styles.previewRow}>💊 Medicines: {form.medicines}</Text> : null}
            {form.disability ? <Text style={styles.previewRow}>♿ Mobility: {form.disability}</Text> : null}
            {form.emergencyContact ? (
              <Text style={styles.previewRow}>📞 Emergency: {form.emergencyContact} · +91 {form.emergencyContactPhone}</Text>
            ) : null}
          </View>
        )}

        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.saveBtnGradient}>
            <Text style={styles.saveBtnText}>{saved ? '✅ Saved!' : 'Save Triage Card'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 24 },
  title: { ...Typography.h3, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  infoBox: {
    backgroundColor: Colors.primaryLight, margin: Spacing.xl, marginBottom: 0,
    borderRadius: Radius.lg, padding: 12,
  },
  infoText: { fontSize: 12, color: Colors.primaryDark, lineHeight: 18 },
  content: { padding: Spacing.xl, gap: 4, paddingBottom: 48 },
  label: { ...Typography.captionMedium, color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  sublabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  chipRow: { gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.primaryDark },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, marginTop: 16,
  },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary,
  },
  textArea: { height: 80, paddingTop: 12 },
  phoneRow: { flexDirection: 'row', gap: 8 },
  countryCode: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, justifyContent: 'center',
  },
  countryText: { fontSize: 14, color: Colors.textPrimary },
  previewCard: {
    backgroundColor: '#0D1B4B', borderRadius: Radius.xl, padding: Spacing.xl,
    marginTop: 20, gap: 6, borderWidth: 1, borderColor: 'rgba(0,201,167,0.3)',
  },
  previewTitle: { color: Colors.primary, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  previewRow: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  saveBtn: { borderRadius: Radius.full, overflow: 'hidden', marginTop: 24 },
  saveBtnGradient: { paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
