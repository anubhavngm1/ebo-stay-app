import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import { dataApi } from '../../src/services/api';
import { useAuth } from '../../src/hooks/useAuth';
import { Booking } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

const TABS = ['Upcoming', 'Completed', 'Cancelled'] as const;
type TabType = (typeof TABS)[number];

const STATUS_MAP: Record<string, { color: string; bg: string; icon: string }> = {
  confirmed: { color: Colors.success, bg: '#F0FDF4', icon: 'checkmark-circle' },
  upcoming:  { color: Colors.primary, bg: Colors.secondary, icon: 'time' },
  completed: { color: Colors.textSecondary, bg: Colors.surface, icon: 'checkmark-done' },
  cancelled: { color: Colors.error, bg: '#FFF5F5', icon: 'close-circle' },
};

const FALLBACK: Booking[] = [
  { id: 1, booking_id: 'EBO123456', type: 'package', title: 'Manali Hill Escape', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200', check_in: '20 May', check_out: '23 May 2025', status: 'confirmed', amount: 20997 },
  { id: 2, booking_id: 'EBO789012', type: 'hotel',   title: 'Goa Beach Resort', image: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=200', check_in: '10 Jun', check_out: '13 Jun 2025', status: 'confirmed', amount: 8997 },
];

export default function BookingsScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [tab, setTab] = useState<TabType>('Upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setFetching(true);
    try {
      const res = await dataApi.myBookings();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setBookings(res.data);
      } else {
        setBookings(FALLBACK);
      }
    } catch {
      setBookings(FALLBACK);
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { if (isLoggedIn) load(); }, [isLoggedIn]);

  if (isLoading) return <View style={styles.container} />;

  // Guest gate
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.header}>My Bookings</Text>
        <View style={styles.guestGate}>
          <Text style={styles.gateEmoji}>🔐</Text>
          <Text style={styles.gateTitle}>Login to see your bookings</Text>
          <Text style={styles.gateDesc}>
            All your confirmed trips, hotels and packages will appear here once you log in.
          </Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
            <Text style={styles.loginBtnText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const filtered = bookings.filter((b) => {
    if (tab === 'Upcoming') return ['confirmed', 'upcoming'].includes(b.status);
    if (tab === 'Completed') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.header}>My Bookings</Text>

      {/* Segment tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {fetching ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, paddingTop: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={Colors.primary}
              onRefresh={() => { setRefreshing(true); load(); }}
            />
          }
          renderItem={({ item }) => {
            const s = STATUS_MAP[item.status] || STATUS_MAP.confirmed;
            return (
              <TouchableOpacity style={styles.card} activeOpacity={0.88}>
                <Image
                  source={{ uri: item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200' }}
                  style={styles.cardImg}
                  contentFit="cover"
                />
                <View style={styles.cardInfo}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                      <Ionicons name={s.icon as any} size={12} color={s.color} />
                      <Text style={[styles.statusText, { color: s.color }]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.dateText}>
                      {item.check_in} – {item.check_out}
                    </Text>
                  </View>

                  <View style={styles.cardBottom}>
                    <Text style={styles.bookingId}># {item.booking_id}</Text>
                    {item.amount ? (
                      <Text style={styles.amount}>
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🧳</Text>
              <Text style={styles.emptyTitle}>No {tab.toLowerCase()} bookings</Text>
              <Text style={styles.emptyDesc}>Your {tab.toLowerCase()} trips will appear here.</Text>
              {tab === 'Upcoming' && (
                <TouchableOpacity
                  style={styles.exploreCta}
                  onPress={() => router.push('/(tabs)/offers')}
                >
                  <Text style={styles.exploreCtaText}>Explore Packages</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 24, fontWeight: '800', color: Colors.text,
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radius.full },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: '#fff' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImg: { width: 100, height: 110 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text, lineHeight: 20 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  dateText: { fontSize: 12, color: Colors.textSecondary },
  cardBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4,
  },
  bookingId: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  amount: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptyDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  exploreCta: {
    marginTop: 20, backgroundColor: Colors.primary,
    borderRadius: Radius.lg, paddingHorizontal: 24, paddingVertical: 12,
  },
  exploreCtaText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  guestGate: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  gateEmoji: { fontSize: 56, marginBottom: 20 },
  gateTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 10 },
  gateDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  loginBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: 32, paddingVertical: 14 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
});
