import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, Radius } from '../src/constants/theme';
import HotelCard from '../src/components/HotelCard';
import { dataApi } from '../src/services/api';
import { Hotel } from '../src/types';

export default function HotelListScreen() {
  const router = useRouter();
  const { dest } = useLocalSearchParams<{ dest?: string }>();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.hotels({ destination: dest });
        if (res.success && res.data) {
          setHotels(Array.isArray(res.data) ? res.data : res.data.hotels || []);
        } else {
          setHotels([
            {
              id: 1,
              name: 'The Manali Inn',
              location: 'Manali, Himachal Pradesh',
              rating: 4.4,
              reviews_count: 120,
              price_per_night: 2999,
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            },
            {
              id: 2,
              name: 'Snow Valley Resort',
              location: 'Manali, Himachal Pradesh',
              rating: 4.6,
              reviews_count: 98,
              price_per_night: 4199,
              image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
            },
            {
              id: 3,
              name: 'River View Cottages',
              location: 'Manali, Himachal Pradesh',
              rating: 4.3,
              reviews_count: 76,
              price_per_night: 2499,
              image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
            },
            {
              id: 4,
              name: 'Premium Hill Resort',
              location: 'Manali, Himachal Pradesh',
              rating: 4.7,
              reviews_count: 150,
              price_per_night: 5299,
              image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
            },
          ]);
        }
      } catch {
        setHotels([
          {
            id: 1,
            name: 'The Manali Inn',
            location: 'Manali, Himachal Pradesh',
            rating: 4.4,
            reviews_count: 120,
            price_per_night: 2999,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          },
        ]);
      }
    })();
  }, [dest]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>Hotels in {dest || 'Manali'}</Text>
          <Text style={styles.sub}>3 Nights • 2 Guests • 1 Room</Text>
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

      <FlatList
        data={hotels}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <HotelCard item={item} onPress={() => router.push(`/hotel/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
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
});
