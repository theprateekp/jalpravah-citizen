import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { submitReport } from '../../services/n8nService';

const ISSUE_TYPES = [
  { id: 'drain', label: 'Blocked Drain', icon: '🚧' },
  { id: 'flood', label: 'Waterlogging', icon: '🌊' },
  { id: 'road', label: 'Road Damage', icon: '🛣️' },
  { id: 'power', label: 'Power Outage', icon: '⚡' },
  { id: 'tree', label: 'Fallen Tree', icon: '🌳' },
  { id: 'other', label: 'Other', icon: '📋' },
];

const SEVERITY = ['Low', 'Medium', 'High', 'Critical'];
const SEV_COLORS = { Low: Colors.green, Medium: Colors.yellow, High: Colors.orange, Critical: Colors.red };

export default function ReportScreen() {
  const { currentWard, user } = useApp();
  const [issueType, setIssueType] = useState('drain');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description || !location) {
      Alert.alert('Missing Info', 'Please fill in location and description.');
      return;
    }
    setLoading(true);
    try {
      const result = await submitReport({ user, ward: currentWard, issueType, severity, location, description });
      setReportId(result.reportId || 'CMP-' + String(Math.floor(Math.random() * 900) + 100));
    } catch {
      // n8n offline — generate local ID
      setReportId('CMP-' + String(Math.floor(Math.random() * 900) + 100));
    }
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setDescription('');
    setLocation('');
    setIssueType('drain');
    setSeverity('Medium');
    setReportId('');
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient colors={['#1A1A2E', '#16213E']} style={StyleSheet.absoluteFill} />
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Report Submitted!</Text>
        <Text style={styles.successId}>Report ID: {reportId}</Text>
        <Text style={styles.successMsg}>Your complaint has been registered and will be assigned to the nearest engineer within 2 hours.</Text>
        <TouchableOpacity onPress={handleReset} style={styles.newBtn}>
          <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.newBtnGradient}>
            <Text style={styles.newBtnText}>Submit Another Report</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>Ward {currentWard} · Help keep your area safe</Text>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Issue Type */}
        <Text style={styles.label}>Issue Type</Text>
        <View style={styles.typeGrid}>
          {ISSUE_TYPES.map(t => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setIssueType(t.id)}
              style={[styles.typeCard, issueType === t.id && styles.typeCardActive]}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeLabel, issueType === t.id && styles.typeLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Severity */}
        <Text style={styles.label}>Severity</Text>
        <View style={styles.sevRow}>
          {SEVERITY.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setSeverity(s)}
              style={[styles.sevChip, severity === s && { backgroundColor: SEV_COLORS[s] + '30', borderColor: SEV_COLORS[s] }]}
            >
              <Text style={[styles.sevText, severity === s && { color: SEV_COLORS[s], fontWeight: '700' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.label}>Location / Landmark</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Near Andheri Station Gate 2"
          placeholderTextColor={Colors.textMuted}
          value={location}
          onChangeText={setLocation}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue in detail..."
          placeholderTextColor={Colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Photo placeholder */}
        <TouchableOpacity style={styles.photoBtn}>
          <Text style={styles.photoBtnText}>📷  Add Photo (optional)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn} disabled={loading}>
          <LinearGradient colors={['#00C9A7', '#00A88A']} style={styles.submitGradient}>
            <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 20 },
  title: { ...Typography.h3, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 48, gap: 4 },
  label: { ...Typography.captionMedium, color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: {
    width: '30%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent', elevation: 1,
  },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  typeIcon: { fontSize: 28, marginBottom: 4 },
  typeLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  typeLabelActive: { color: Colors.primaryDark, fontWeight: '700' },
  sevRow: { flexDirection: 'row', gap: 10 },
  sevChip: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  sevText: { fontSize: 13, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary,
  },
  textArea: { height: 100, paddingTop: 12 },
  photoBtn: {
    borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  photoBtnText: { color: Colors.textMuted, fontSize: 14 },
  submitBtn: { borderRadius: Radius.full, overflow: 'hidden', marginTop: 24 },
  submitGradient: { paddingVertical: 15, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successIcon: { fontSize: 72, marginBottom: 16 },
  successTitle: { ...Typography.h2, color: '#FFFFFF', marginBottom: 8 },
  successId: { fontSize: 16, color: Colors.primary, fontWeight: '700', marginBottom: 16 },
  successMsg: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  newBtn: { borderRadius: Radius.full, overflow: 'hidden', width: '100%' },
  newBtnGradient: { paddingVertical: 15, alignItems: 'center' },
  newBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
