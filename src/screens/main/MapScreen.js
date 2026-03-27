import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { RiskColors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { WARDS, HOTSPOTS } from '../../data/wardData';

const { width } = Dimensions.get('window');

const RISK_ORDER = { RED: 0, ORANGE: 1, YELLOW: 2, GREEN: 3 };

export default function MapScreen() {
  const { currentWard, setCurrentWard, setCurrentRisk, setCurrentPMRS } = useApp();

  const sorted = [...WARDS].sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk]);

  const selectWard = (w) => {
    setCurrentWard(w.code);
    setCurrentRisk(w.risk);
    setCurrentPMRS(w.pmrs);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
        <Text style={styles.title}>Flood Risk Map</Text>
        <Text style={styles.subtitle}>Mumbai Ward-Level Risk Overview</Text>
      </LinearGradient>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(RiskColors).map(([key, val]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: val.dot }]} />
            <Text style={styles.legendText}>{val.label}</Text>
          </View>
        ))}
      </View>

      {/* Visual map placeholder with ward grid */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapNote}>Interactive map — tap a ward below to select</Text>
      </View>

      {/* Hotspots */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Flood Hotspots</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotspotScroll} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 10 }}>
        {HOTSPOTS.map(h => (
          <View key={h.id} style={[styles.hotspotCard, { borderTopColor: RiskColors[h.risk].dot }]}>
            <View style={[styles.fviBadge, { backgroundColor: RiskColors[h.risk].bg }]}>
              <Text style={[styles.fviText, { color: RiskColors[h.risk].text }]}>FVI {h.fvi}</Text>
            </View>
            <Text style={styles.hotspotName}>{h.name}</Text>
            <Text style={styles.hotspotMeta}>💧 {h.depth}cm depth</Text>
            <Text style={styles.hotspotMeta}>👥 {(h.pop / 1000).toFixed(0)}k affected</Text>
          </View>
        ))}
      </ScrollView>

      {/* Ward list */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Wards</Text>
      </View>
      <ScrollView style={styles.wardList} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 32, gap: 8 }}>
        {sorted.map(w => (
          <TouchableOpacity
            key={w.code}
            onPress={() => selectWard(w)}
            style={[styles.wardRow, currentWard === w.code && styles.wardRowActive]}
          >
            <View style={[styles.riskDot, { backgroundColor: RiskColors[w.risk].dot }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.wardName}>{w.name}</Text>
              <Text style={styles.wardMeta}>Ward {w.code} · PMRS: {w.pmrs} · {w.hotspots} hotspots</Text>
            </View>
            <View style={[styles.riskPill, { backgroundColor: RiskColors[w.risk].bg }]}>
              <Text style={[styles.riskPillText, { color: RiskColors[w.risk].text }]}>{w.risk}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 20 },
  title: { ...Typography.h3, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.surface, paddingVertical: 10, paddingHorizontal: Spacing.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  mapPlaceholder: {
    height: 160, backgroundColor: '#0F3460', margin: Spacing.xl, borderRadius: Radius.xl,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  mapEmoji: { fontSize: 48 },
  mapNote: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  sectionHeader: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: 8 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary },
  hotspotScroll: { maxHeight: 140 },
  hotspotCard: {
    width: 140, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: 12, borderTopWidth: 3, elevation: 2,
  },
  fviBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, marginBottom: 6 },
  fviText: { fontSize: 11, fontWeight: '700' },
  hotspotName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  hotspotMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  wardList: { flex: 1 },
  wardRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 12, elevation: 1,
  },
  wardRowActive: { borderWidth: 1.5, borderColor: Colors.primary },
  riskDot: { width: 10, height: 10, borderRadius: 5 },
  wardName: { ...Typography.bodyMedium, color: Colors.textPrimary },
  wardMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  riskPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  riskPillText: { fontSize: 11, fontWeight: '700' },
});
