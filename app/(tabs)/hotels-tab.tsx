import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import { dataApi } from '../../src/services/api';
import { Hotel } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

export default function HotelsTab() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.hotels();
        if (res?.success && res.data) {
          setHotels(Array.isArray(res.data) ? res.data : []);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.header}>Hotels</Text>
      <Text style={styles.sub}>Find your perfect stay</Text>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(h) => String(h.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const uri = item.image?.startsWith('http')
              ? item.image
              : item.image
              ? `https://www.ebostay.com/assets/images/hotels/${item.image}`
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
            const price = Number(item.price_per_night || 0);
            const rating = Number(item.rating || item.star_rating || 4.2).toFixed(1);
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => router.push(`/hotel/${item.id}`)}
              >
                <Image source={{ uri }} style={styles.img} contentFit="cover" />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.loc} numberOfLines={1}>
                    {item.location || item.city || 'India'}
                  </Text>
                  <View style={styles.row}>
                    <Ionicons name="star" size={12} color="#FBBF24" />
                    <Text style={styles.rating}>{rating}</Text>
                  </View>
                  <View style={styles.bottom}>
                    <Text style={styles.price}>
                      ₹{price > 0 ? price.toLocaleString('en-IN') : '—'}
                      <Text style={styles.night}> /night</Text>
                    </Text>
                    <View style={styles.cta}>
                      <Text style={styles.ctaText}>View Details</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 40 }}>
              No hotels found
            </Text>
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
    paddingHorizontal: 20, paddingTop: 56,
  },
  sub: { fontSize: 13, color: Colors.textSecondary, paddingHorizontal: 20, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    height: 118,
  },
  img: { width: 110, height: 118, backgroundColor: Colors.surface },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text },
  loc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  night: { fontSize: 11, fontWeight: '500', color: Colors.textMuted },
  cta: {
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  ctaText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});
