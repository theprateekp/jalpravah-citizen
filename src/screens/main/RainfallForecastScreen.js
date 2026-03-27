import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { RiskColors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { WARD_PMRS_DETAIL, CITY_STATS } from '../../data/floodEngineData';
import { FORECAST_7DAY } from '../../data/wardData';
import { fetchWeather, parseWeatherResponse } from '../../services/n8nService';

const { width } = Dimensions.get('window');

// 72-hour hourly forecast simulation
const HOURLY_72H = [
  { hour: '6AM',  rain: 12, risk: 'GREEN'  }, { hour: '9AM',  rain: 28, risk: 'YELLOW' },
  { hour: '12PM', rain: 45, risk: 'YELLOW' }, { hour: '3PM',  rain: 72, risk: 'ORANGE' },
  { hour: '6PM',  rain: 95, risk: 'ORANGE' }, { hour: '9PM',  rain: 118, risk: 'RED'   },
  { hour: '12AM', rain: 88, risk: 'ORANGE' }, { hour: '3AM',  rain: 62, risk: 'ORANGE' },
  { hour: '6AM',  rain: 48, risk: 'YELLOW' }, { hour: '9AM',  rain: 35, risk: 'YELLOW' },
  { hour: '12PM', rain: 22, risk: 'GREEN'  }, { hour: '3PM',  rain: 18, risk: 'GREEN'  },
];

const MAX_RAIN = 140;

function RainBar({ value, risk, hour }) {
  const rc = RiskColors[risk];
  const pct = Math.min((value / MAX_RAIN) * 100, 100);
  return (
    <View style={styles.rainBarCol}>
      <Text style={styles.rainBarValue}>{value}</Text>
      <View style={styles.rainBarTrack}>
        <View style={[styles.rainBarFill, { height: `${pct}%`, backgroundColor: rc.dot }]} />
      </View>
      <Text style={styles.rainBarHour}>{hour}</Text>
    </View>
  );
}

export default function RainfallForecastScreen({ navigation }) {
  const { currentWard, currentRisk } = useApp();
  const [liveWeather, setLiveWeather] = useState(null);
  const wardDetail = WARD_PMRS_DETAIL.find(w => w.code === currentWard) || WARD_PMRS_DETAIL[1];
  const threshold = wardDetail.rainfall.intensity24h;
  const forecast72h = CITY_STATS.rainfallForecast72h;
  const willFlood = forecast72h >= threshold;

  useEffect(() => {
    fetchWeather(wardDetail.terrain.avgElevation, 72.877)
      .then(data => setLiveWeather(parseWeatherResponse(data)))
      .catch(() => {}); // silently fall back to static data
  }, [currentWard]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1A1A2E', '#0F3460']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🌧️ Rainfall Forecast</Text>
        <Text style={styles.subtitle}>Ward {currentWard} · {liveWeather ? '🟢 Live — Open-Meteo' : '📦 Cached data'}</Text>

        {/* Flood risk alert */}
        <View style={[styles.alertBanner, { backgroundColor: willFlood ? 'rgba(255,59,92,0.2)' : 'rgba(0,201,167,0.15)' }]}>
          <Text style={styles.alertIcon}>{willFlood ? '⚠️' : '✅'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { color: willFlood ? Colors.red : Colors.primary }]}>
              {willFlood ? 'Flood Risk: HIGH' : 'Flood Risk: Manageable'}
            </Text>
            <Text style={styles.alertSub}>
              {forecast72h}mm expected in 72h · Flood trigger: {threshold}mm
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* 72h bar chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>72-Hour Rainfall Intensity</Text>
          <Text style={styles.cardSub}>mm/hr · Flood trigger at {threshold}mm</Text>

          {/* Threshold line indicator */}
          <View style={styles.thresholdRow}>
            <View style={styles.thresholdLine} />
            <Text style={styles.thresholdLabel}>Flood threshold</Text>
          </View>

          <View style={styles.rainChart}>
            {HOURLY_72H.map((h, i) => (
              <RainBar key={i} value={h.rain} risk={h.risk} hour={h.hour} />
            ))}
          </View>
          <Text style={styles.chartNote}>⚡ Peak intensity expected tonight 9PM — {HOURLY_72H[5].rain}mm/hr</Text>
        </View>

        {/* 7-day forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>7-Day Outlook</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {FORECAST_7DAY.map((f, i) => {
              const risk = f.rain >= 80 ? 'RED' : f.rain >= 60 ? 'ORANGE' : f.rain >= 35 ? 'YELLOW' : 'GREEN';
              const rc = RiskColors[risk];
              return (
                <View key={i} style={[styles.dayCard, i === 0 && { borderColor: Colors.primary, borderWidth: 1.5 }]}>
                  <Text style={styles.dayLabel}>{f.day}</Text>
                  <Text style={styles.dayEmoji}>{f.emoji}</Text>
                  <Text style={styles.dayDesc}>{f.desc}</Text>
                  <View style={[styles.rainPill, { backgroundColor: rc.bg }]}>
                    <Text style={[styles.rainPillText, { color: rc.text }]}>{f.rain}%</Text>
                  </View>
                  <Text style={styles.dayTemp}>{f.high}° / {f.low}°</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* What to do based on forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Your Forecast Action Plan</Text>
          {[
            willFlood && { time: 'Now', icon: '🎒', action: 'Prepare emergency kit: medicines, ID, water, torch, phone charger', urgent: true },
            willFlood && { time: 'Before 6PM', icon: '🏠', action: 'Move valuables to upper floors. Park vehicles on high ground', urgent: true },
            { time: 'Tonight', icon: '📱', action: 'Keep JalPravah notifications ON. Check alerts every hour', urgent: false },
            { time: 'Tomorrow', icon: '🚶', action: 'Avoid walking through waterlogged streets — hidden manholes are dangerous', urgent: false },
            { time: 'This week', icon: '📍', action: `Know your nearest safe spot: ${wardDetail.resources.shelterCapacity.toLocaleString()} capacity available`, urgent: false },
          ].filter(Boolean).map((item, i) => (
            <View key={i} style={[styles.actionRow, item.urgent && styles.actionRowUrgent]}>
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTime, item.urgent && { color: Colors.red }]}>{item.time}</Text>
                <Text style={styles.actionText}>{item.action}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Rainfall vs ward threshold comparison */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Rainfall vs Flood Threshold</Text>
          <Text style={styles.cardSub}>How close is your ward to flooding?</Text>
          <View style={styles.thresholdCompare}>
            <View style={styles.thresholdItem}>
              <Text style={[styles.thresholdNum, { color: Colors.info }]}>{forecast72h}mm</Text>
              <Text style={styles.thresholdItemLabel}>72h Forecast</Text>
            </View>
            <Text style={styles.thresholdVs}>vs</Text>
            <View style={styles.thresholdItem}>
              <Text style={[styles.thresholdNum, { color: Colors.red }]}>{threshold}mm</Text>
              <Text style={styles.thresholdItemLabel}>Flood Trigger</Text>
            </View>
          </View>
          <View style={styles.compareBar}>
            <View style={[styles.compareBarFill, {
              width: `${Math.min((forecast72h / threshold) * 100, 100)}%`,
              backgroundColor: willFlood ? Colors.red : Colors.primary,
            }]} />
            <View style={[styles.compareThresholdMark, { left: '100%' }]} />
          </View>
          <Text style={styles.compareNote}>
            {willFlood
              ? `⚠️ Forecast exceeds flood threshold by ${forecast72h - threshold}mm`
              : `✅ ${threshold - forecast72h}mm below flood threshold`}
          </Text>
        </View>

        {/* Data source */}
        <View style={styles.sourceCard}>
          <Text style={styles.sourceText}>
            📡 Data: Open-Meteo API · ISRO Bhuvan DEM · IMD Historical Records
          </Text>
          <Text style={styles.sourceUpdate}>Last updated: {CITY_STATS.lastUpdated}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 24 },
  backBtn: { marginBottom: 8 },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  title: { ...Typography.h3, color: '#FFFFFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2, marginBottom: 16 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radius.lg, padding: 14 },
  alertIcon: { fontSize: 28 },
  alertTitle: { fontSize: 15, fontWeight: '800' },
  alertSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  content: { padding: Spacing.xl, gap: 16, paddingBottom: 48 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, elevation: 2 },
  cardTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: 12, color: Colors.textMuted, marginBottom: 12 },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  thresholdLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.red, borderStyle: 'dashed' },
  thresholdLabel: { fontSize: 11, color: Colors.red, fontWeight: '600' },
  rainChart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4 },
  rainBarCol: { flex: 1, alignItems: 'center' },
  rainBarValue: { fontSize: 8, color: Colors.textMuted, marginBottom: 2 },
  rainBarTrack: { flex: 1, width: '80%', backgroundColor: Colors.borderLight, borderRadius: 3, justifyContent: 'flex-end', overflow: 'hidden' },
  rainBarFill: { width: '100%', borderRadius: 3 },
  rainBarHour: { fontSize: 8, color: Colors.textMuted, marginTop: 3, textAlign: 'center' },
  chartNote: { fontSize: 12, color: Colors.orange, fontWeight: '600', marginTop: 10, textAlign: 'center' },
  dayCard: {
    width: 80, backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: 10, alignItems: 'center', gap: 4,
  },
  dayLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  dayEmoji: { fontSize: 24 },
  dayDesc: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  rainPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  rainPillText: { fontSize: 11, fontWeight: '700' },
  dayTemp: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, alignItems: 'flex-start' },
  actionRowUrgent: { backgroundColor: Colors.redBg, borderRadius: Radius.md, padding: 10, borderBottomWidth: 0, marginBottom: 4 },
  actionIcon: { fontSize: 22 },
  actionTime: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 2 },
  actionText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  thresholdCompare: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 12 },
  thresholdItem: { alignItems: 'center' },
  thresholdNum: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  thresholdItemLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  thresholdVs: { fontSize: 16, color: Colors.textMuted, fontWeight: '600' },
  compareBar: { height: 10, backgroundColor: Colors.borderLight, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  compareBarFill: { height: '100%', borderRadius: 5 },
  compareThresholdMark: { position: 'absolute', top: 0, width: 2, height: '100%', backgroundColor: Colors.red },
  compareNote: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  sourceCard: { backgroundColor: '#0D1B4B', borderRadius: Radius.lg, padding: 12, alignItems: 'center' },
  sourceText: { fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  sourceUpdate: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
});
