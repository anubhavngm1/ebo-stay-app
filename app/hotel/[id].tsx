import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';
import { dataApi } from '../../src/services/api';
import { Hotel } from '../../src/types';

const { width } = Dimensions.get('window');

export default function HotelDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const res = await dataApi.hotel(id);
        if (!live) return;
        if (res?.success && res.data) setHotel(res.data);
        else setHotel({
          id: Number(id) || 1, name: 'Hotel Stay', location: 'India', rating: 4.3,
          reviews_count: 30, price_per_night: 2999,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          description: 'Comfortable rooms with modern amenities.',
          amenities: ['Free WiFi', 'Breakfast', 'Parking', 'View'],
        });
      } catch {
        if (!live) return;
        setHotel({
          id: Number(id) || 1, name: 'Hotel Stay', location: 'India', rating: 4.3,
          price_per_night: 2999,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          description: 'Unable to load full details. You can still continue.',
          amenities: ['WiFi', 'Parking'],
        });
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.hint}>Loading hotel...</Text>
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>Hotel not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 16, width: 160 }} fullWidth={false} />
      </View>
    );
  }

  const imageUri = hotel.image?.startsWith('http') ? hotel.image : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: imageUri }} style={styles.hero} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.name}>{hotel.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.star} />
            <Text style={styles.rating}>{hotel.rating || 4.2} ({hotel.reviews_count || 0} Reviews)</Text>
          </View>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} /> {hotel.location || hotel.city || 'India'}
          </Text>
          <View style={styles.amenities}>
            {(hotel.amenities || ['Free WiFi', 'Breakfast', 'Parking', 'View']).map((a) => (
              <View key={String(a)} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.sectionTitle}>About Property</Text>
          <Text style={styles.desc}>{hotel.description || 'Comfortable stay with modern amenities.'}</Text>
          <Text style={styles.sectionTitle}>Select Room</Text>
          <View style={styles.roomCard}>
            <View>
              <Text style={styles.roomName}>Deluxe Room</Text>
              <Text style={styles.roomPrice}>₹{Number(hotel.price_per_night || 0).toLocaleString('en-IN')} / night</Text>
            </View>
            <TouchableOpacity style={styles.selectBtn}>
              <Text style={styles.selectText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>₹{Number(hotel.price_per_night || 0).toLocaleString('en-IN')} / night</Text>
          <Text style={styles.taxes}>Inclusive of taxes</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: '/booking/dates',
              params: { type: 'hotel', id: String(hotel.id), title: hotel.name, price: String(hotel.price_per_night || 0) },
            })
          }
          style={{ width: 140 }}
          fullWidth={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 },
  hint: { marginTop: 12, color: Colors.textSecondary },
  hero: { width, height: 260, backgroundColor: Colors.surface },
  backBtn: {
    position: 'absolute', top: 50, left: 16, width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 20 },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  rating: { fontSize: FontSize.sm, color: Colors.textSecondary },
  location: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 6 },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  amenityChip: { backgroundColor: Colors.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  amenityText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginTop: 24, marginBottom: 10 },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
  roomCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  roomName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  roomPrice: { fontSize: FontSize.sm, color: Colors.primary, marginTop: 4, fontWeight: '600' },
  selectBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary },
  selectText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: '#fff',
  },
  price: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  taxes: { fontSize: 11, color: Colors.textMuted },
});
