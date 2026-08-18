import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../../src/constants/theme';
import { dataApi } from '../../src/services/api';
import { Booking } from '../../src/types';

const tabs = ['Upcoming', 'Completed', 'Cancelled'] as const;

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await dataApi.myBookings();
      if (res.success && res.data) {
        setBookings(Array.isArray(res.data) ? res.data : []);
      } else {
        // Sample
        setBookings([
          {
            id: 1,
            booking_id: 'EBO123456',
            type: 'package',
            title: 'Manali Trip',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200',
            check_in: '20 May',
            check_out: '23 May 2024',
            status: 'confirmed',
          },
          {
            id: 2,
            booking_id: 'EBO789012',
            type: 'package',
            title: 'Goa Beach Package',
            image: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=200',
            check_in: '10 Jun',
            check_out: '13 Jun 2024',
            status: 'confirmed',
          },
          {
            id: 3,
            booking_id: 'EBO345678',
            type: 'hotel',
            title: 'Kerala Backwater Houseboat Stay',
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200',
            check_in: '05 Jul',
            check_out: '08 Jul 2024',
            status: 'confirmed',
          },
        ]);
      }
    } catch {
      setBookings([
        {
          id: 1,
          booking_id: 'EBO123456',
          type: 'package',
          title: 'Manali Trip',
          image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200',
          check_in: '20 May',
          check_out: '23 May 2024',
          status: 'confirmed',
        },
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <Image
              source={{
                uri: item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
              }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.dates}>
                {item.check_in} – {item.check_out}
              </Text>
              <Text style={styles.bookingId}>{item.booking_id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  dates: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bookingId: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginTop: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
});
