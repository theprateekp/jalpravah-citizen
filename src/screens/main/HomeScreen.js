import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { RiskColors } from '../../theme/colors';
import { WARDS, HOTSPOTS, SAFE_SPOTS, HELPLINES } from '../../data/wardData';

const RISK_LABEL = { GREEN: 'Low Risk', YELLOW: 'Caution', ORANGE: 'High Risk', RED: 'Critical' };

export default function HomeScreen({ navigation }) {
  const { user, currentRisk, currentWard, currentPMRS } = useApp();
  const riskColor = RiskColors[currentRisk];
  const ward = WARDS.find(w => w.code === currentWard) || WARDS[1];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Citizen'} 👋</Text>
            <Text style={styles.wardLabel}>📍 Ward {currentWard} · {ward.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={[styles.riskBadge, { backgroundColor: riskColor.bg }]}>
              <View style={[styles.riskDot, { backgroundColor: riskColor.dot }]} />
              <Text style={[styles.riskText, { color: riskColor.text }]}>{RISK_LABEL[currentRisk]}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>{user?.name?.[0]?.toUpperCase() || 'C'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PMRS Score — tappable */}
        <TouchableOpacity onPress={() => navigation.navigate('FloodIntel')} activeOpacity={0.85}>
        <View style={styles.pmrsCard}>
          <Text style={styles.pmrsScore}>{currentPMRS}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.pmrsLabel}>Pre-Monsoon Readiness Score</Text>
            <Text style={styles.pmrsDesc}>Your ward's flood preparedness index</Text>
          </View>
          <Text style={styles.pmrsTap}>View details →</Text>
        </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Flood Intelligence Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flood Intelligence</Text>
        <View style={styles.intelGrid}>
          <TouchableOpacity onPress={() => navigation.navigate('FloodIntel')} style={styles.intelCard}>
            <LinearGradient colors={['#0F3460', '#1A1A2E']} style={styles.intelGradient}>
              <Text style={styles.intelIcon}>📊</Text>
              <Text style={styles.intelTitle}>PMRS Breakdown</Text>
              <Text style={styles.intelSub}>Drainage · Terrain · Resources</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MicroHotspot')} style={styles.intelCard}>
            <LinearGradient colors={['#3D0C11', '#1A1A2E']} style={styles.intelGradient}>
              <Text style={styles.intelIcon}>🔴</Text>
              <Text style={styles.intelTitle}>Micro-Hotspots</Text>
              <Text style={styles.intelSub}>2,500+ zones monitored</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RainfallForecast')} style={styles.intelCard}>
            <LinearGradient colors={['#0D1B4B', '#1A1A2E']} style={styles.intelGradient}>
              <Text style={styles.intelIcon}>🌧️</Text>
              <Text style={styles.intelTitle}>72h Forecast</Text>
              <Text style={styles.intelSub}>Rainfall vs flood threshold</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('VoiceAgent')} style={styles.intelCard}>
            <LinearGradient colors={['#1A0A2E', '#1A1A2E']} style={styles.intelGradient}>
              <Text style={styles.intelIcon}>🤖</Text>
              <Text style={styles.intelTitle}>Jal-Sahayak</Text>
              <Text style={styles.intelSub}>AI voice guidance</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: '🆘', label: 'SOS Alert', color: '#FF3B5C', screen: 'SOS' },
            { icon: '📍', label: 'Safe Spots', color: '#00C9A7', screen: null },
            { icon: '📞', label: 'Helplines', color: '#4A90E2', screen: 'SOS' },
            { icon: '🗺️', label: 'Flood Map', color: '#6C63FF', screen: 'Map' },
          ].map(a => (
            <TouchableOpacity key={a.label} onPress={() => a.screen && navigation.navigate(a.screen)} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '20' }]}>
                <Text style={styles.actionEmoji}>{a.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Flood Hotspots */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Nearby Hotspots</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MicroHotspot')}>
            <Text style={styles.sectionLink}>See all →</Text>
          </TouchableOpacity>
        </View>
        {HOTSPOTS.slice(0, 3).map(h => (
          <View key={h.id} style={styles.hotspotCard}>
            <View style={[styles.hotspotDot, { backgroundColor: RiskColors[h.risk].dot }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hotspotName}>{h.name}</Text>
              <Text style={styles.hotspotMeta}>Ward {h.ward} · Depth: {h.depth}cm · FVI: {h.fvi}</Text>
            </View>
            <View style={[styles.riskPill, { backgroundColor: RiskColors[h.risk].bg }]}>
              <Text style={[styles.riskPillText, { color: RiskColors[h.risk].text }]}>{h.risk}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Safe Spots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safe Spots</Text>
        {SAFE_SPOTS.slice(0, 3).map(s => (
          <View key={s.id} style={styles.safeCard}>
            <Text style={styles.safeIcon}>{s.type === 'hospital' ? '🏥' : s.type === 'camp' ? '⛺' : '🏟️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.safeName}>{s.name}</Text>
              <Text style={styles.safeMeta}>Capacity: {s.capacity.toLocaleString()} · {s.distance}km away</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: s.status === 'OPEN' ? Colors.primaryLight : Colors.yellowBg }]}>
              <Text style={[styles.statusText, { color: s.status === 'OPEN' ? Colors.primaryDark : Colors.yellow }]}>{s.status}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Helplines */}
      <View style={[styles.section, { marginBottom: 32 }]}>
        <Text style={styles.sectionTitle}>Emergency Helplines</Text>
        <View style={styles.helplinesGrid}>
          {HELPLINES.slice(0, 4).map(h => (
            <TouchableOpacity key={h.number} style={styles.helplineCard}>
              <Text style={styles.helplineIcon}>{h.icon}</Text>
              <Text style={styles.helplineNumber}>{h.number}</Text>
              <Text style={styles.helplineDept} numberOfLines={2}>{h.dept}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { ...Typography.h3, color: '#FFFFFF' },
  wardLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 },
  riskBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  riskText: { fontSize: 13, fontWeight: '600' },
  profileBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  profileBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  pmrsCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.lg, padding: 16,
  },
  pmrsScore: { fontSize: 48, fontWeight: '800', color: Colors.primary, letterSpacing: -2 },
  pmrsLabel: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  pmrsDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  pmrsTap: { color: Colors.primary, fontSize: 12, fontWeight: '600', marginTop: 4 },
  section: { padding: Spacing.xl, paddingBottom: 0 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionLink: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  intelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  intelCard: { width: '47%', borderRadius: Radius.xl, overflow: 'hidden', elevation: 3 },
  intelGradient: { padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl, minHeight: 90 },
  intelIcon: { fontSize: 28, marginBottom: 6 },
  intelTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  intelSub: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  actionsGrid: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, alignItems: 'center', elevation: 2 },
  actionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionEmoji: { fontSize: 24 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  hotspotCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, marginBottom: 8, elevation: 1,
  },
  hotspotDot: { width: 10, height: 10, borderRadius: 5 },
  hotspotName: { ...Typography.bodyMedium, color: Colors.textPrimary },
  hotspotMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  riskPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  riskPillText: { fontSize: 11, fontWeight: '700' },
  safeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, marginBottom: 8, elevation: 1,
  },
  safeIcon: { fontSize: 28 },
  safeName: { ...Typography.bodyMedium, color: Colors.textPrimary },
  safeMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: 11, fontWeight: '700' },
  helplinesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  helplineCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: 14, alignItems: 'center', elevation: 1,
  },
  helplineIcon: { fontSize: 28, marginBottom: 6 },
  helplineNumber: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  helplineDept: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
});
