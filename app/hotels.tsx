import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../src/constants/theme';
import HotelCard from '../src/components/HotelCard';
import { dataApi } from '../src/services/api';
import { Hotel } from '../src/types';
import { StatusBar } from 'expo-status-bar';

export default function HotelListScreen() {
  const router = useRouter();
  const { dest } = useLocalSearchParams<{ dest?: string }>();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const res = await dataApi.hotels();
        let list: Hotel[] = [];
        if (res?.success && res.data) {
          list = Array.isArray(res.data) ? res.data : res.data.hotels || [];
        }
        if (dest && list.length > 0) {
          const q = String(dest).toLowerCase();
          const filtered = list.filter((h) => {
            const loc = `${h.location || ''} ${h.city || ''} ${h.name || ''}`.toLowerCase();
            return loc.includes(q);
          });
          // if filter empty, still show all rather than blank
          list = filtered.length > 0 ? filtered : list;
        }
        if (!live) return;
        setHotels(list);
      } catch {
        if (!live) return;
        setHotels([]);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [dest]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Hotels{dest ? ` in ${dest}` : ''}</Text>
          <Text style={styles.sub}>3 Nights · 2 Guests · 1 Room</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="swap-vertical" size={16} color={Colors.text} />
          <Text style={styles.filterText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={16} color={Colors.text} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <HotelCard item={item} onPress={() => router.push(`/hotel/${item.id}`)} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No hotels found</Text>
              <Text style={styles.emptySub}>Try another destination</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    gap: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 13, color: Colors.textSecondary, marginTop: 6 },
});
