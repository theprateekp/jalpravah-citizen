import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { HELPLINES, SAFE_SPOTS } from '../../data/wardData';
import { createMeshPacket, enqueueMeshPacket, getPendingPackets, getBLEStatusMessage } from '../../services/MeshNetwork';
import { sendSOSAlert } from '../../services/n8nService';

const SOS_TYPES = [
  { id: 'trapped',     label: 'Trapped in Flood',      icon: '🆘', color: Colors.red },
  { id: 'medical',     label: 'Medical Help',           icon: '🚑', color: '#FF6B35' },
  { id: 'evacuation',  label: 'Need Evacuation',        icon: '🏃', color: Colors.orange },
  { id: 'food_water',  label: 'Food / Water Shortage',  icon: '💧', color: Colors.info },
  { id: 'electricity', label: 'Electricity Issue',      icon: '⚡', color: Colors.yellow },
  { id: 'rescue',      label: 'Rescue Needed',          icon: '⛑️', color: Colors.accent },
];

export default function SOSScreen({ navigation }) {
  const { user, currentWard, isOnline, triageData, queueOfflineSOS, setMeshStatus } = useApp();
  const [sosSent, setSosSent] = useState(false);
  const [sosType, setSosType] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [meshMsg, setMeshMsg] = useState('');

  useEffect(() => {
    (async () => {
      const pending = await getPendingPackets();
      setPendingCount(pending.length);
      const { msg } = getBLEStatusMessage(pending.length);
      setMeshMsg(msg);
    })();
  }, [sosSent]);

  const sendSOS = async (type) => {
    setSosType(type);

    const sosPayload = {
      type: type.id,
      severity: type.id === 'trapped' || type.id === 'rescue' ? 'CRITICAL' : 'HIGH',
      message: `${type.label} — Ward ${currentWard}`,
      triage: triageData,
    };

    if (!isOnline) {
      // Offline: create BLE mesh packet and queue locally
      const packet = createMeshPacket(sosPayload, user, currentWard);
      await enqueueMeshPacket(packet);
      await queueOfflineSOS(sosPayload);
      setMeshStatus('relaying');
      const pending = await getPendingPackets();
      setPendingCount(pending.length);
    } else {
      // Online: send via n8n workflow
      try {
        await sendSOSAlert({ user, ward: currentWard, ...sosPayload });
      } catch (e) {
        // n8n unreachable — fall back to local queue silently
        await queueOfflineSOS(sosPayload);
      }
    }

    setSosSent(true);
  };

  const callNumber = (num) => {
    Linking.openURL(`tel:${num}`).catch(() =>
      Alert.alert('Error', 'Unable to make call from this device.')
    );
  };

  if (sosSent && sosType) {
    const hasTriage = triageData?.bloodType || triageData?.medicines || triageData?.allergies;
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.sosActiveContainer}>
        <LinearGradient colors={['#3D0C11', '#1A1A2E']} style={StyleSheet.absoluteFill} />

        <Text style={styles.sosActiveIcon}>🆘</Text>
        <Text style={styles.sosActiveTitle}>SOS SENT</Text>
        <Text style={styles.sosActiveType}>{sosType.icon} {sosType.label}</Text>

        {/* Transmission status */}
        <View style={[styles.statusBanner, { backgroundColor: isOnline ? 'rgba(0,201,167,0.15)' : 'rgba(255,184,0,0.15)' }]}>
          <Text style={[styles.statusBannerText, { color: isOnline ? Colors.primary : Colors.yellow }]}>
            {isOnline
              ? '📡 Sent to nearest response center via internet'
              : `📡 Queued via Bluetooth mesh · ${pendingCount} packet(s) relaying`}
          </Text>
        </View>

        {/* User info */}
        <View style={styles.sosInfoCard}>
          <Text style={styles.sosInfoTitle}>Emergency Details Sent</Text>
          <Text style={styles.sosInfoRow}>👤 {user?.name || 'Citizen'}</Text>
          <Text style={styles.sosInfoRow}>📱 +91 {user?.phone || '—'}</Text>
          <Text style={styles.sosInfoRow}>📍 Ward {currentWard}</Text>
          <Text style={styles.sosInfoRow}>🚨 Type: {sosType.label}</Text>
          <Text style={styles.sosInfoRow}>⏱️ Response ETA: ~15 min</Text>
        </View>

        {/* Triage info sent */}
        {hasTriage && (
          <View style={styles.triageCard}>
            <Text style={styles.triageTitle}>🏥 Medical Info Sent to Aid Center</Text>
            {triageData.bloodType ? <Text style={styles.triageRow}>🩸 Blood: {triageData.bloodType}</Text> : null}
            {triageData.diabetes ? <Text style={styles.triageRow}>💉 Diabetic</Text> : null}
            {triageData.allergies ? <Text style={styles.triageRow}>⚠️ Allergies: {triageData.allergies}</Text> : null}
            {triageData.medicines ? <Text style={styles.triageRow}>💊 {triageData.medicines}</Text> : null}
            {triageData.disability ? <Text style={styles.triageRow}>♿ {triageData.disability}</Text> : null}
            {triageData.emergencyContact ? (
              <Text style={styles.triageRow}>📞 {triageData.emergencyContact} · +91 {triageData.emergencyContactPhone}</Text>
            ) : null}
          </View>
        )}

        {!hasTriage && (
          <TouchableOpacity onPress={() => navigation.navigate('TriageCard')} style={styles.triagePrompt}>
            <Text style={styles.triagePromptText}>+ Add medical info to future SOS alerts</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sosMsg}>
          Emergency services have been notified. Stay calm and stay in place if safe to do so.
        </Text>

        <TouchableOpacity onPress={() => callNumber('112')} style={styles.callBtn}>
          <LinearGradient colors={[Colors.red, '#CC0033']} style={styles.callBtnGradient}>
            <Text style={styles.callBtnText}>📞 Call 112 — National Emergency</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('VoiceAgent')} style={styles.voiceBtn}>
          <LinearGradient colors={['#0D1B4B', '#1A1A2E']} style={styles.voiceBtnGradient}>
            <Text style={styles.voiceBtnText}>🤖 Get Voice Guidance — Jal-Sahayak</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSosSent(false)} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel SOS</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#3D0C11', '#1A1A2E']} style={styles.header}>
        <Text style={styles.title}>🆘 Emergency SOS</Text>
        <Text style={styles.subtitle}>Tap to alert rescue teams instantly</Text>
      </LinearGradient>

      {/* Offline mesh status */}
      {!isOnline && (
        <View style={styles.meshBanner}>
          <Text style={styles.meshBannerText}>
            📡 Offline Mode — SOS will relay via Bluetooth mesh network
          </Text>
          {pendingCount > 0 && (
            <Text style={styles.meshPending}>{pendingCount} packet(s) queued for relay</Text>
          )}
        </View>
      )}

      {/* Triage card status */}
      <TouchableOpacity onPress={() => navigation.navigate('TriageCard')} style={styles.triageBanner}>
        <Text style={styles.triageBannerIcon}>🏥</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.triageBannerTitle}>Digital Triage Card</Text>
          <Text style={styles.triageBannerSub}>
            {triageData?.bloodType
              ? `Blood: ${triageData.bloodType} · Sent automatically with SOS`
              : 'Tap to pre-fill medical info — sent with every SOS'}
          </Text>
        </View>
        <Text style={styles.triageBannerArrow}>›</Text>
      </TouchableOpacity>

      {/* SOS Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Emergency Type</Text>
        <View style={styles.sosGrid}>
          {SOS_TYPES.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => sendSOS(s)}
              style={[styles.sosCard, { borderColor: s.color }]}
            >
              <Text style={styles.sosIcon}>{s.icon}</Text>
              <Text style={[styles.sosLabel, { color: s.color }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Voice Agent CTA */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => navigation.navigate('VoiceAgent')} style={styles.voiceAgentCard}>
          <LinearGradient colors={['#0D1B4B', '#1A1A2E']} style={styles.voiceAgentGradient}>
            <Text style={styles.voiceAgentIcon}>🤖</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.voiceAgentTitle}>Jal-Sahayak Voice Agent</Text>
              <Text style={styles.voiceAgentSub}>Step-by-step guidance in your language</Text>
            </View>
            <Text style={styles.voiceAgentArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Helplines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Call Directly</Text>
        {HELPLINES.map(h => (
          <TouchableOpacity key={h.number} onPress={() => callNumber(h.number)} style={styles.helplineRow}>
            <Text style={styles.helplineIcon}>{h.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.helplineDept}>{h.dept}</Text>
              <Text style={styles.helplineNumber}>{h.number}</Text>
            </View>
            <View style={[styles.callPill, { backgroundColor: h.color + '20' }]}>
              <Text style={[styles.callPillText, { color: h.color }]}>Call</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safe Spots */}
      <View style={[styles.section, { marginBottom: 48 }]}>
        <Text style={styles.sectionTitle}>Nearest Safe Spots</Text>
        {SAFE_SPOTS.slice(0, 4).map(s => (
          <View key={s.id} style={styles.safeRow}>
            <Text style={styles.safeIcon}>{s.type === 'hospital' ? '🏥' : s.type === 'camp' ? '⛺' : '🏟️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.safeName}>{s.name}</Text>
              <Text style={styles.safeMeta}>{s.distance}km · Cap: {s.capacity.toLocaleString()}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: s.status === 'OPEN' ? Colors.primaryLight : Colors.yellowBg }]}>
              <Text style={[styles.statusText, { color: s.status === 'OPEN' ? Colors.primaryDark : Colors.yellow }]}>{s.status}</Text>
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
  meshBanner: { backgroundColor: 'rgba(255,184,0,0.12)', padding: 12, paddingHorizontal: Spacing.xl },
  meshBannerText: { color: Colors.yellow, fontSize: 13, fontWeight: '600' },
  meshPending: { color: 'rgba(255,184,0,0.7)', fontSize: 11, marginTop: 2 },
  triageBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0D1B4B', margin: Spacing.xl, marginBottom: 0,
    borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: 'rgba(0,201,167,0.3)',
  },
  triageBannerIcon: { fontSize: 28 },
  triageBannerTitle: { ...Typography.bodyMedium, color: '#FFFFFF' },
  triageBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  triageBannerArrow: { color: Colors.primary, fontSize: 20, fontWeight: '700' },
  section: { padding: Spacing.xl, paddingBottom: 0 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },
  sosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sosCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: 20, alignItems: 'center', borderWidth: 2, elevation: 2,
  },
  sosIcon: { fontSize: 36, marginBottom: 8 },
  sosLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  voiceAgentCard: { borderRadius: Radius.xl, overflow: 'hidden', elevation: 3 },
  voiceAgentGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(0,201,167,0.3)', borderRadius: Radius.xl,
  },
  voiceAgentIcon: { fontSize: 32 },
  voiceAgentTitle: { ...Typography.bodyMedium, color: '#FFFFFF' },
  voiceAgentSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  voiceAgentArrow: { color: Colors.primary, fontSize: 20, fontWeight: '700' },
  helplineRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, marginBottom: 8, elevation: 1,
  },
  helplineIcon: { fontSize: 28 },
  helplineDept: { ...Typography.bodyMedium, color: Colors.textPrimary },
  helplineNumber: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  callPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  callPillText: { fontWeight: '700', fontSize: 13 },
  safeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, marginBottom: 8, elevation: 1,
  },
  safeIcon: { fontSize: 28 },
  safeName: { ...Typography.bodyMedium, color: Colors.textPrimary },
  safeMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: 11, fontWeight: '700' },
  // SOS Active
  sosActiveContainer: { alignItems: 'center', padding: Spacing.xl, paddingTop: 80, paddingBottom: 60 },
  sosActiveIcon: { fontSize: 80, marginBottom: 16 },
  sosActiveTitle: { fontSize: 40, fontWeight: '900', color: Colors.red, letterSpacing: 4, marginBottom: 4 },
  sosActiveType: { fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
  statusBanner: { borderRadius: Radius.lg, padding: 10, marginBottom: 16, width: '100%' },
  statusBannerText: { fontSize: 13, textAlign: 'center', fontWeight: '600' },
  sosInfoCard: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl,
    padding: Spacing.xl, width: '100%', gap: 8, marginBottom: 12,
  },
  sosInfoTitle: { color: Colors.primary, fontWeight: '700', fontSize: 13, marginBottom: 4 },
  sosInfoRow: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  triageCard: {
    backgroundColor: 'rgba(0,201,167,0.1)', borderRadius: Radius.xl,
    padding: Spacing.xl, width: '100%', gap: 6, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(0,201,167,0.3)',
  },
  triageTitle: { color: Colors.primary, fontWeight: '700', fontSize: 13, marginBottom: 4 },
  triageRow: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  triagePrompt: { marginBottom: 12 },
  triagePromptText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  sosMsg: { color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 22, marginBottom: 24, marginTop: 8 },
  callBtn: { borderRadius: Radius.full, overflow: 'hidden', width: '100%', marginBottom: 10 },
  callBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  callBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  voiceBtn: { borderRadius: Radius.full, overflow: 'hidden', width: '100%', marginBottom: 10 },
  voiceBtnGradient: { paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,201,167,0.4)', borderRadius: Radius.full },
  voiceBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  cancelBtn: { paddingVertical: 14 },
  cancelText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
