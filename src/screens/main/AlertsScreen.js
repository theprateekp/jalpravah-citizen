import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { Colors, Typography, Spacing, Radius } from '../../theme/colors';

const ALERT_ICONS = { orange: '🟠', red: '🔴', yellow: '🟡', green: '🟢', info: '🔵' };

function getIcon(title) {
  const t = title.toLowerCase();
  if (t.includes('red')) return '🔴';
  if (t.includes('orange')) return '🟠';
  if (t.includes('yellow')) return '🟡';
  if (t.includes('safe') || t.includes('open')) return '🟢';
  return '🔵';
}

export default function AlertsScreen() {
  const { notifications, markNotificationRead, unreadCount } = useApp();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
        <Text style={styles.title}>Alerts & Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount} unread</Text>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={notifications}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => markNotificationRead(item.id)}
            style={[styles.card, !item.read && styles.cardUnread]}
          >
            <Text style={styles.icon}>{getIcon(item.title)}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.read && <View style={styles.dot} />}
              </View>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No alerts right now</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...Typography.h3, color: '#FFFFFF' },
  badge: { backgroundColor: Colors.orange, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  list: { padding: Spacing.xl, gap: 10 },
  card: {
    flexDirection: 'row', gap: 12, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: 14, elevation: 1,
    borderLeftWidth: 3, borderLeftColor: 'transparent',
  },
  cardUnread: { borderLeftColor: Colors.primary, backgroundColor: Colors.primaryLight },
  icon: { fontSize: 28, marginTop: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  cardBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  cardTime: { fontSize: 11, color: Colors.textMuted, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
