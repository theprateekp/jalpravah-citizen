import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';
import { RiskColors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { WARDS, FORECAST_7DAY } from '../../data/wardData';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout, currentWard, currentRisk, currentPMRS, language, setLanguage } = useApp();
  const ward = WARDS.find(w => w.code === currentWard) || WARDS[1];
  const riskColor = RiskColors[currentRisk];

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { logout(); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#1A1A2E', '#0F3460']} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'C'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Citizen'}</Text>
        <Text style={styles.phone}>📱 +91 {user?.phone || '—'}</Text>
        <View style={[styles.riskBadge, { backgroundColor: riskColor.bg }]}>
          <View style={[styles.riskDot, { backgroundColor: riskColor.dot }]} />
          <Text style={[styles.riskText, { color: riskColor.text }]}>Ward {currentWard} · {currentRisk} Alert</Text>
        </View>
      </LinearGradient>

      {/* PMRS Card */}
      <View style={styles.pmrsCard}>
        <View style={styles.pmrsLeft}>
          <Text style={styles.pmrsScore}>{currentPMRS}</Text>
          <Text style={styles.pmrsLabel}>PMRS</Text>
        </View>
        <View style={styles.pmrsDivider} />
        <View style={styles.pmrsRight}>
          <Text style={styles.pmrsWardName}>{ward.name}</Text>
          <Text style={styles.pmrsMeta}>Zone: {ward.zone} · Pop: {(ward.pop / 1000).toFixed(0)}k</Text>
          <Text style={styles.pmrsMeta}>Active Hotspots: {ward.hotspots}</Text>
        </View>
      </View>

      {/* 7-Day Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {FORECAST_7DAY.map((f, i) => (
            <View key={i} style={[styles.forecastCard, i === 0 && styles.forecastCardToday]}>
              <Text style={styles.forecastDay}>{f.day}</Text>
              <Text style={styles.forecastEmoji}>{f.emoji}</Text>
              <Text style={styles.forecastRain}>{f.rain}%</Text>
              <Text style={styles.forecastTemp}>{f.high}°</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map(l => (
            <TouchableOpacity
              key={l.code}
              onPress={() => setLanguage(l.code)}
              style={[styles.langChip, language === l.code && styles.langChipActive]}
            >
              <Text style={[styles.langText, language === l.code && styles.langTextActive]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {[
          { icon: '🔔', label: 'Push Notifications', value: 'On' },
          { icon: '📍', label: 'Location Access', value: 'Always' },
          { icon: '🌐', label: 'Offline Mode', value: 'Auto' },
          { icon: '📞', label: 'Emergency Contacts', value: 'Manage' },
        ].map(s => (
          <TouchableOpacity key={s.label} style={styles.settingRow}>
            <Text style={styles.settingIcon}>{s.icon}</Text>
            <Text style={styles.settingLabel}>{s.label}</Text>
            <Text style={styles.settingValue}>{s.value} ›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutApp}>🌊 JalPravah v1.0.0</Text>
          <Text style={styles.aboutDesc}>Citizen Safety Platform by Team Meghalytics</Text>
          <Text style={styles.aboutPowered}>Powered by ISRO Bhuvan · Open-Meteo · Vapi AI</Text>
        </View>
      </View>

      {/* Logout */}
      <View style={[styles.section, { marginBottom: 48 }]}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32, paddingHorizontal: Spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  name: { ...Typography.h3, color: '#FFFFFF', marginBottom: 4 },
  phone: { color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 12 },
  riskBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  riskText: { fontSize: 13, fontWeight: '600' },
  pmrsCard: {
    flexDirection: 'row', backgroundColor: Colors.surface, margin: Spacing.xl,
    borderRadius: Radius.xl, padding: Spacing.xl, elevation: 3, alignItems: 'center',
  },
  pmrsLeft: { alignItems: 'center', paddingRight: Spacing.xl },
  pmrsScore: { fontSize: 48, fontWeight: '800', color: Colors.primary, letterSpacing: -2 },
  pmrsLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  pmrsDivider: { width: 1, height: 60, backgroundColor: Colors.border, marginRight: Spacing.xl },
  pmrsRight: { flex: 1 },
  pmrsWardName: { ...Typography.bodyMedium, color: Colors.textPrimary, marginBottom: 4 },
  pmrsMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  section: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },
  forecastCard: {
    width: 70, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: 10, alignItems: 'center', gap: 4, elevation: 1,
  },
  forecastCardToday: { backgroundColor: Colors.primaryLight, borderWidth: 1.5, borderColor: Colors.primary },
  forecastDay: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  forecastEmoji: { fontSize: 22 },
  forecastRain: { fontSize: 12, color: Colors.info, fontWeight: '600' },
  forecastTemp: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  langRow: { flexDirection: 'row', gap: 10 },
  langChip: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.surface,
  },
  langChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  langText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  langTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: 14, marginBottom: 8, elevation: 1,
  },
  settingIcon: { fontSize: 20, marginRight: 12 },
  settingLabel: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  settingValue: { fontSize: 13, color: Colors.textMuted },
  aboutCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl, alignItems: 'center', elevation: 1 },
  aboutApp: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  aboutDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  aboutPowered: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  logoutBtn: {
    borderWidth: 1.5, borderColor: Colors.red, borderRadius: Radius.full,
    paddingVertical: 14, alignItems: 'center',
  },
  logoutText: { color: Colors.red, fontWeight: '700', fontSize: 15 },
});
