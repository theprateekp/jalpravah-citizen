import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { RiskColors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { getMicroHotspots, CITY_STATS } from '../../data/floodEngineData';

const TYPE_ICONS = { subway: '🚇', nala: '🌊', lowland: '🏞️', road: '🛣️', residential: '🏘️' };
const TYPE_LABELS = { subway: 'Subway/Underpass', nala: 'Nala/Canal', lowland: 'Low-lying Area', road: 'Road Flooding', residential: 'Residential Zone' };
const RISK_ORDER = { RED: 0, ORANGE: 1, YELLOW: 2, GREEN: 3 };

export default function MicroHotspotScreen({ navigation }) {
  const { currentWard } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('fvi');
  const [allHotspots, setAllHotspots] = useState([]);

  // Load lazily after mount so it doesn't block startup
  useEffect(() => {
    const timer = setTimeout(() => setAllHotspots(getMicroHotspots()), 100);
    return () => clearTimeout(timer);
  }, []);

  const wardHotspots = useMemo(() => {
    let data = allHotspots.filter(h => h.ward === currentWard);
    if (filter !== 'ALL') data = data.filter(h => h.risk === filter);
    if (search) data = data.filter(h => h.type.includes(search.toLowerCase()));
    data.sort((a, b) => sortBy === 'fvi' ? b.fvi - a.fvi : sortBy === 'depth' ? b.depth - a.depth : RISK_ORDER[a.risk] - RISK_ORDER[b.risk]);
    return data;
  }, [currentWard, filter, search, sortBy, allHotspots]);

  const stats = useMemo(() => ({
    red: wardHotspots.filter(h => h.risk === 'RED').length,
    orange: wardHotspots.filter(h => h.risk === 'ORANGE').length,
    yellow: wardHotspots.filter(h => h.risk === 'YELLOW').length,
    green: wardHotspots.filter(h => h.risk === 'GREEN').length,
  }), [wardHotspots]);

  const renderItem = ({ item }) => {
    const rc = RiskColors[item.risk];
    return (
      <View style={[styles.hotspotCard, { borderLeftColor: rc.dot }]}>
        <View style={styles.hotspotTop}>
          <Text style={styles.hotspotTypeIcon}>{TYPE_ICONS[item.type]}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.hotspotType}>{TYPE_LABELS[item.type]}</Text>
            <Text style={styles.hotspotCoords}>
              {item.lat.toFixed(4)}°N, {item.lng.toFixed(4)}°E
            </Text>
          </View>
          <View style={[styles.fviBadge, { backgroundColor: rc.bg }]}>
            <Text style={[styles.fviText, { color: rc.text }]}>FVI {item.fvi}</Text>
          </View>
        </View>
        <View style={styles.hotspotStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.depth}cm</Text>
            <Text style={styles.statLabel}>Flood Depth</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.elevation}m</Text>
            <Text style={styles.statLabel}>Elevation</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.drainageCapacity}%</Text>
            <Text style={styles.statLabel}>Drain Cap.</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.floodHistory}x</Text>
            <Text style={styles.statLabel}>History</Text>
          </View>
        </View>
        {item.risk === 'RED' && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠️ Avoid this area during heavy rain</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1A2E', '#0F3460']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Micro-Hotspot Map</Text>
        <Text style={styles.subtitle}>Ward {currentWard} · {wardHotspots.length} zones monitored</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Critical', count: stats.red, color: Colors.red },
            { label: 'High Risk', count: stats.orange, color: Colors.orange },
            { label: 'Caution', count: stats.yellow, color: Colors.yellow },
            { label: 'Safe', count: stats.green, color: Colors.green },
          ].map(s => (
            <View key={s.label} style={styles.statBox}>
              <Text style={[styles.statBoxNum, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.statBoxLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* City-wide context */}
      <View style={styles.cityRow}>
        <Text style={styles.cityText}>
          🌆 City-wide: {CITY_STATS.totalMicroBasins.toLocaleString()} basins · {CITY_STATS.criticalHotspots} critical
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {['ALL', 'RED', 'ORANGE', 'YELLOW', 'GREEN'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && { backgroundColor: f === 'ALL' ? Colors.primary : RiskColors[f]?.dot || Colors.primary }]}>
            <Text style={[styles.filterText, filter === f && { color: '#FFF' }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {[{ id: 'fvi', label: 'FVI' }, { id: 'depth', label: 'Depth' }, { id: 'risk', label: 'Risk' }].map(s => (
          <TouchableOpacity key={s.id} onPress={() => setSortBy(s.id)}
            style={[styles.sortChip, sortBy === s.id && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sortBy === s.id && styles.sortChipTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={wardHotspots}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>No hotspots match this filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 20 },
  backBtn: { marginBottom: 8 },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  title: { ...Typography.h3, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.md, padding: 10, alignItems: 'center' },
  statBoxNum: { fontSize: 22, fontWeight: '800' },
  statBoxLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  cityRow: { backgroundColor: '#0D1B4B', paddingHorizontal: Spacing.xl, paddingVertical: 8 },
  cityText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.xl, paddingVertical: 10, backgroundColor: Colors.surface },
  filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  filterText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.xl, paddingVertical: 8, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sortLabel: { fontSize: 12, color: Colors.textMuted },
  sortChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: Colors.background },
  sortChipActive: { backgroundColor: Colors.primaryLight },
  sortChipText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  sortChipTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  list: { padding: Spacing.xl, gap: 10, paddingBottom: 48 },
  hotspotCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, borderLeftWidth: 4, elevation: 2 },
  hotspotTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  hotspotTypeIcon: { fontSize: 28 },
  hotspotType: { ...Typography.bodyMedium, color: Colors.textPrimary },
  hotspotCoords: { fontSize: 11, color: Colors.textMuted, marginTop: 2, fontFamily: 'monospace' },
  fviBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  fviText: { fontSize: 12, fontWeight: '800' },
  hotspotStats: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },
  warningBanner: { backgroundColor: Colors.redBg, borderRadius: Radius.md, padding: 8, marginTop: 10 },
  warningText: { fontSize: 12, color: Colors.red, fontWeight: '600', textAlign: 'center' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
