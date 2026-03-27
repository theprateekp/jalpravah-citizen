import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { RiskColors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { WARD_PMRS_DETAIL, CITY_STATS, getDeploymentPlan } from '../../data/floodEngineData';

const { width } = Dimensions.get('window');

const PRIORITY_COLORS = { CRITICAL: Colors.red, HIGH: Colors.orange, MEDIUM: Colors.yellow };

// Translate technical gaps into citizen-friendly language
const CITIZEN_ACTIONS = {
  'CRITICAL': { label: 'Act Now', color: Colors.red, bg: '#FFE8ED' },
  'HIGH':     { label: 'Be Ready', color: Colors.orange, bg: '#FFF0EB' },
  'MEDIUM':   { label: 'Stay Informed', color: Colors.yellow, bg: '#FFF8E1' },
};

function PMRSGauge({ score }) {
  const color = score < 35 ? Colors.red : score < 50 ? Colors.orange : score < 65 ? Colors.yellow : Colors.green;
  const pct = score / 100;
  return (
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeTrack}>
        <View style={[styles.gaugeFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.gaugeLabels}>
        <Text style={styles.gaugeMin}>0</Text>
        <Text style={[styles.gaugeScore, { color }]}>{score}/100</Text>
        <Text style={styles.gaugeMax}>100</Text>
      </View>
      <View style={styles.gaugeTicks}>
        {[25, 50, 75].map(t => (
          <View key={t} style={[styles.gaugeTick, { left: `${t}%` }]} />
        ))}
      </View>
    </View>
  );
}

function ScoreBar({ label, value, max = 100, color }) {
  return (
    <View style={styles.scoreBarRow}>
      <Text style={styles.scoreBarLabel}>{label}</Text>
      <View style={styles.scoreBarTrack}>
        <View style={[styles.scoreBarFill, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.scoreBarValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function FloodIntelScreen({ navigation }) {
  const { currentWard, currentRisk, currentPMRS } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const wardDetail = WARD_PMRS_DETAIL.find(w => w.code === currentWard) || WARD_PMRS_DETAIL[1];
  const riskColor = RiskColors[currentRisk];
  const plan = getDeploymentPlan(wardDetail);
  const blockedPct = Math.round((wardDetail.drainage.blocked / wardDetail.drainage.total) * 100);

  const TABS = ['overview', 'drainage', 'history', 'actions'];

  // Citizen-friendly interpretation of PMRS
  const pmrsInterpretation = currentPMRS < 35
    ? 'Your ward is critically underprepared for heavy rain. High chance of flooding.'
    : currentPMRS < 50
    ? 'Your ward has significant flood risk. Prepare an emergency kit now.'
    : currentPMRS < 65
    ? 'Moderate flood risk. Stay alert and know your nearest safe spot.'
    : 'Your ward is relatively well-prepared. Stay informed during heavy rain.';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1A2E', '#0F3460']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Flood Intelligence</Text>
        <Text style={styles.subtitle}>Ward {currentWard} · {wardDetail.name}</Text>

        {/* PMRS Hero */}
        <View style={styles.pmrsHero}>
          <View style={styles.pmrsLeft}>
            <Text style={[styles.pmrsBig, { color: riskColor.dot }]}>{currentPMRS}</Text>
            <Text style={styles.pmrsUnit}>/ 100</Text>
          </View>
          <View style={styles.pmrsRight}>
            <View style={[styles.riskPill, { backgroundColor: riskColor.bg }]}>
              <View style={[styles.riskDot, { backgroundColor: riskColor.dot }]} />
              <Text style={[styles.riskPillText, { color: riskColor.text }]}>{currentRisk} ALERT</Text>
            </View>
            <Text style={styles.pmrsLabel}>Pre-Monsoon Readiness Score</Text>
            <Text style={styles.pmrsInterpret}>{pmrsInterpretation}</Text>
          </View>
        </View>
        <PMRSGauge score={currentPMRS} />
      </LinearGradient>

      {/* City-wide banner */}
      <View style={styles.cityBanner}>
        <Text style={styles.cityBannerText}>
          🌆 Mumbai · {CITY_STATS.criticalHotspots} critical zones · {CITY_STATS.totalMicroBasins.toLocaleString()} micro-basins monitored
        </Text>
        <Text style={styles.cityBannerSub}>Updated: {CITY_STATS.lastUpdated}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} onPress={() => setActiveTab(t)}
            style={[styles.tab, activeTab === t && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 48 }}>

        {activeTab === 'overview' && (
          <View style={{ gap: 16 }}>
            {/* PMRS breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📊 PMRS Score Breakdown</Text>
              <Text style={styles.cardSub}>How your ward's readiness is calculated</Text>
              <View style={{ gap: 10, marginTop: 12 }}>
                <ScoreBar label="Drainage" value={wardDetail.drainage.score} color={Colors.info} />
                <ScoreBar label="Rainfall Readiness" value={Math.round((1 - wardDetail.rainfall.intensity24h / 200) * 25)} max={25} color={Colors.primary} />
                <ScoreBar label="Pump Resources" value={Math.min(wardDetail.resources.pumps * 2, 20)} max={20} color={Colors.accent} />
                <ScoreBar label="Terrain Safety" value={Math.round(Math.min(wardDetail.terrain.avgElevation / 15, 1) * 15)} max={15} color={Colors.yellow} />
                <ScoreBar label="Historical Safety" value={Math.max(0, 10 - wardDetail.historical.floodYears.length)} max={10} color={Colors.green} />
              </View>
            </View>

            {/* What this means for you */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏠 What This Means For You</Text>
              <View style={{ gap: 10, marginTop: 8 }}>
                {[
                  { icon: '💧', label: 'Expected flood depth', value: `${wardDetail.historical.avgDepth}cm avg · ${wardDetail.historical.maxDepth}cm max` },
                  { icon: '🌧️', label: '24h rainfall threshold', value: `${wardDetail.rainfall.intensity24h}mm triggers flooding` },
                  { icon: '🏘️', label: 'Micro-basins in your ward', value: `${wardDetail.microBasins} monitored zones` },
                  { icon: '🚨', label: 'Active hotspots', value: `${wardDetail.hotspotCount} high-risk locations` },
                  { icon: '⛑️', label: 'Rescue teams available', value: `${wardDetail.resources.teams} teams · ${wardDetail.resources.vehicles} vehicles` },
                  { icon: '🏟️', label: 'Shelter capacity', value: `${wardDetail.resources.shelterCapacity.toLocaleString()} people` },
                ].map(item => (
                  <View key={item.label} style={styles.infoRow}>
                    <Text style={styles.infoIcon}>{item.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>{item.label}</Text>
                      <Text style={styles.infoValue}>{item.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Terrain */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🗻 Terrain & Elevation</Text>
              <View style={styles.terrainGrid}>
                {[
                  { label: 'Avg Elevation', value: `${wardDetail.terrain.avgElevation}m` },
                  { label: 'Min Elevation', value: `${wardDetail.terrain.minElevation}m`, warn: wardDetail.terrain.minElevation < 3 },
                  { label: 'Basin Area', value: `${wardDetail.terrain.basinArea} km²` },
                  { label: 'Slope Grade', value: `${wardDetail.terrain.slope}°` },
                ].map(t => (
                  <View key={t.label} style={[styles.terrainCard, t.warn && { borderColor: Colors.red, borderWidth: 1.5 }]}>
                    <Text style={[styles.terrainValue, t.warn && { color: Colors.red }]}>{t.value}</Text>
                    <Text style={styles.terrainLabel}>{t.label}</Text>
                    {t.warn && <Text style={styles.terrainWarn}>⚠️ Flood risk</Text>}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'drainage' && (
          <View style={{ gap: 16 }}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚧 Drainage Status</Text>
              <View style={styles.drainageHero}>
                <Text style={[styles.drainagePct, { color: blockedPct > 50 ? Colors.red : blockedPct > 30 ? Colors.orange : Colors.green }]}>
                  {blockedPct}%
                </Text>
                <Text style={styles.drainageLabel}>Drains Blocked</Text>
                <Text style={styles.drainageSub}>{wardDetail.drainage.blocked} of {wardDetail.drainage.total} drains</Text>
              </View>
              <View style={styles.drainageBar}>
                <View style={[styles.drainageBarFill, {
                  width: `${blockedPct}%`,
                  backgroundColor: blockedPct > 50 ? Colors.red : blockedPct > 30 ? Colors.orange : Colors.green
                }]} />
              </View>
              <View style={{ gap: 8, marginTop: 16 }}>
                {[
                  { label: 'Drain capacity', value: `${wardDetail.drainage.capacity}% of design capacity` },
                  { label: 'Last cleaned', value: wardDetail.drainage.lastCleaned },
                  { label: 'Pump sets active', value: `${wardDetail.resources.pumps} pumps · ${wardDetail.resources.pumpCapacity} L/min` },
                ].map(d => (
                  <View key={d.label} style={styles.drainRow}>
                    <Text style={styles.drainLabel}>{d.label}</Text>
                    <Text style={styles.drainValue}>{d.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚠️ Known Issues in Your Ward</Text>
              {wardDetail.gaps.map((gap, i) => (
                <View key={i} style={styles.gapRow}>
                  <Text style={styles.gapBullet}>•</Text>
                  <Text style={styles.gapText}>{gap}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: Colors.primaryLight }]}>
              <Text style={[styles.cardTitle, { color: Colors.primaryDark }]}>💡 What You Can Do</Text>
              {[
                'Clear debris from the drain nearest to your home before monsoon',
                'Report any blocked drain using the Report tab',
                'Do not dump waste into storm drains',
                'Keep ground floor belongings elevated during heavy rain alerts',
              ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipNum}>{i + 1}</Text>
                  <Text style={[styles.tipText, { color: Colors.primaryDark }]}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={{ gap: 16 }}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📅 Flood History</Text>
              <Text style={styles.cardSub}>Years your ward experienced significant flooding</Text>
              <View style={styles.yearGrid}>
                {wardDetail.historical.floodYears.map(y => (
                  <View key={y} style={styles.yearChip}>
                    <Text style={styles.yearText}>{y}</Text>
                  </View>
                ))}
              </View>
              <View style={{ gap: 8, marginTop: 16 }}>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>Average flood depth</Text>
                  <Text style={[styles.histValue, { color: Colors.orange }]}>{wardDetail.historical.avgDepth} cm</Text>
                </View>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>Maximum recorded depth</Text>
                  <Text style={[styles.histValue, { color: Colors.red }]}>{wardDetail.historical.maxDepth} cm</Text>
                </View>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>Flood events in 20 years</Text>
                  <Text style={styles.histValue}>{wardDetail.historical.floodYears.length} times</Text>
                </View>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>Return period</Text>
                  <Text style={styles.histValue}>Every {wardDetail.rainfall.returnPeriod} years</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌧️ Rainfall Data</Text>
              <View style={{ gap: 8 }}>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>Annual average rainfall</Text>
                  <Text style={styles.histValue}>{wardDetail.rainfall.annualAvg} mm</Text>
                </View>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>24h intensity (flood trigger)</Text>
                  <Text style={[styles.histValue, { color: Colors.red }]}>{wardDetail.rainfall.intensity24h} mm</Text>
                </View>
                <View style={styles.histRow}>
                  <Text style={styles.histLabel}>72h forecast</Text>
                  <Text style={[styles.histValue, { color: Colors.orange }]}>{CITY_STATS.rainfallForecast72h} mm expected</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'actions' && (
          <View style={{ gap: 12 }}>
            <View style={styles.actionHeader}>
              <Text style={styles.cardTitle}>🚨 Your Action Plan</Text>
              <Text style={styles.cardSub}>Based on your ward's PMRS of {currentPMRS}/100</Text>
            </View>
            {plan.map((item, i) => {
              const c = CITIZEN_ACTIONS[item.priority];
              return (
                <View key={i} style={[styles.actionCard, { backgroundColor: c.bg, borderLeftColor: c.color }]}>
                  <View style={styles.actionTop}>
                    <Text style={styles.actionIcon}>{item.icon}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: c.color }]}>
                      <Text style={styles.priorityText}>{c.label}</Text>
                    </View>
                    <Text style={styles.actionEta}>⏱ {item.eta}</Text>
                  </View>
                  <Text style={[styles.actionText, { color: c.color }]}>{item.action}</Text>
                </View>
              );
            })}

            <TouchableOpacity onPress={() => navigation.navigate('SOS')} style={styles.sosBtn}>
              <LinearGradient colors={[Colors.red, '#CC0033']} style={styles.sosBtnGradient}>
                <Text style={styles.sosBtnText}>🆘 Trigger SOS if in danger</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('VoiceAgent')} style={styles.voiceBtn}>
              <LinearGradient colors={['#0D1B4B', '#1A1A2E']} style={styles.voiceBtnGradient}>
                <Text style={styles.voiceBtnText}>🤖 Get voice guidance — Jal-Sahayak</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  pmrsHero: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 16 },
  pmrsLeft: { flexDirection: 'row', alignItems: 'flex-end' },
  pmrsBig: { fontSize: 56, fontWeight: '900', letterSpacing: -2 },
  pmrsUnit: { fontSize: 18, color: 'rgba(255,255,255,0.4)', marginBottom: 10 },
  pmrsRight: { flex: 1 },
  riskPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start', marginBottom: 6 },
  riskDot: { width: 7, height: 7, borderRadius: 4 },
  riskPillText: { fontSize: 11, fontWeight: '700' },
  pmrsLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  pmrsInterpret: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 17 },
  gaugeContainer: { marginTop: 4 },
  gaugeTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 4 },
  gaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  gaugeMin: { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
  gaugeScore: { fontSize: 12, fontWeight: '700' },
  gaugeMax: { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
  gaugeTicks: { position: 'absolute', top: 0, left: 0, right: 0, height: 8 },
  gaugeTick: { position: 'absolute', width: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.3)' },
  cityBanner: { backgroundColor: '#0D1B4B', paddingHorizontal: Spacing.xl, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cityBannerText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', flex: 1 },
  cityBannerSub: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  body: { flex: 1 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, elevation: 2 },
  cardTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreBarLabel: { fontSize: 12, color: Colors.textSecondary, width: 110 },
  scoreBarTrack: { flex: 1, height: 6, backgroundColor: Colors.borderLight, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreBarValue: { fontSize: 12, fontWeight: '700', width: 28, textAlign: 'right' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoIcon: { fontSize: 20, marginTop: 1 },
  infoLabel: { fontSize: 12, color: Colors.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 1 },
  terrainGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  terrainCard: { width: '47%', backgroundColor: Colors.background, borderRadius: Radius.lg, padding: 12, alignItems: 'center' },
  terrainValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  terrainLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  terrainWarn: { fontSize: 10, color: Colors.red, marginTop: 2 },
  drainageHero: { alignItems: 'center', paddingVertical: 12 },
  drainagePct: { fontSize: 52, fontWeight: '900', letterSpacing: -2 },
  drainageLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  drainageSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  drainageBar: { height: 10, backgroundColor: Colors.borderLight, borderRadius: 5, overflow: 'hidden', marginVertical: 8 },
  drainageBarFill: { height: '100%', borderRadius: 5 },
  drainRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  drainLabel: { fontSize: 13, color: Colors.textSecondary },
  drainValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  gapRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  gapBullet: { color: Colors.orange, fontWeight: '700', fontSize: 16 },
  gapText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  tipRow: { flexDirection: 'row', gap: 10, marginTop: 8, alignItems: 'flex-start' },
  tipNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, color: '#FFF', fontSize: 12, fontWeight: '800', textAlign: 'center', lineHeight: 22 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  yearChip: { backgroundColor: Colors.redBg, paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  yearText: { color: Colors.red, fontWeight: '700', fontSize: 13 },
  histRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  histLabel: { fontSize: 13, color: Colors.textSecondary },
  histValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  actionHeader: { marginBottom: 4 },
  actionCard: { borderRadius: Radius.lg, padding: 14, borderLeftWidth: 4 },
  actionTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  actionIcon: { fontSize: 20 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  priorityText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  actionEta: { fontSize: 11, color: Colors.textMuted, marginLeft: 'auto' },
  actionText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  sosBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  sosBtnGradient: { paddingVertical: 15, alignItems: 'center' },
  sosBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  voiceBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  voiceBtnGradient: { paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,201,167,0.3)', borderRadius: Radius.full },
  voiceBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
