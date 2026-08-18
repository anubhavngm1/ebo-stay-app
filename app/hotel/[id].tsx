import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';
import { dataApi } from '../../src/services/api';
import { Hotel } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const IMG_H = 280;

const FALLBACK: Hotel = {
  id: 0, name: 'The Manali Inn', location: 'Manali, Himachal Pradesh',
  rating: 4.4, reviews_count: 120, price_per_night: 2999,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  description: 'Cosy mountain retreat with modern amenities, panoramic views and warm hospitality.',
  amenities: ['Free WiFi', 'Breakfast', 'Parking', 'Mountain View', 'AC'],
};

export default function HotelDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.hotel(id);
        setHotel(res?.success && res.data ? res.data : { ...FALLBACK, id: Number(id) });
      } catch {
        setHotel({ ...FALLBACK, id: Number(id) });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <StatusBar style="dark" />
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: Colors.textSecondary }}>Hotel not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imgUri = hotel.image?.startsWith('http')
    ? hotel.image
    : `https://www.ebostay.com/assets/images/${hotel.image}`;

  const price = Number(hotel.price_per_night || 2999);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: imgUri }} style={styles.hero} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishBtn}
            onPress={() => setWishlisted((w) => !w)}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={wishlisted ? '#EF4444' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name + rating */}
          <View style={styles.titleRow}>
            <Text style={styles.name}>{hotel.name}</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#FBBF24" />
              <Text style={styles.ratingText}>{hotel.rating || 4.4}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.location}>{hotel.location}</Text>
          </View>

          <Text style={styles.reviewsLine}>
            {hotel.reviews_count || 120} verified reviews
          </Text>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            {[
              { icon: 'wifi-outline', label: 'Free WiFi' },
              { icon: 'restaurant-outline', label: 'Breakfast' },
              { icon: 'car-outline', label: 'Parking' },
              { icon: 'shield-checkmark-outline', label: 'Verified' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name={s.icon as any} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesWrap}>
                {hotel.amenities.map((a) => (
                  <View key={a} style={styles.amenityChip}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* About */}
          <Text style={styles.sectionTitle}>About Property</Text>
          <Text style={styles.desc}>{hotel.description || FALLBACK.description}</Text>

          {/* Room */}
          <Text style={styles.sectionTitle}>Select Room</Text>
          <View style={styles.roomCard}>
            <View style={styles.roomLeft}>
              <Text style={styles.roomName}>Deluxe Room</Text>
              <View style={styles.roomFeatures}>
                {['2 Adults', 'King Bed', '25 m²'].map((f) => (
                  <View key={f} style={styles.roomFeatureTag}>
                    <Text style={styles.roomFeatureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.roomRight}>
              <Text style={styles.roomPrice}>₹{price.toLocaleString('en-IN')}</Text>
              <Text style={styles.perNight}>/night</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₹{price.toLocaleString('en-IN')}</Text>
          <Text style={styles.footerPerNight}>per night · incl. taxes</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: '/booking/dates',
              params: { type: 'hotel', id: String(hotel.id), title: hotel.name, price: String(price) },
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
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  heroWrap: { height: IMG_H, position: 'relative' },
  hero: { width, height: IMG_H },
  backBtn: {
    position: 'absolute', top: 50, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  wishBtn: {
    position: 'absolute', top: 50, right: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 20, paddingBottom: 100 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  name: { flex: 1, fontSize: 22, fontWeight: '800', color: Colors.text },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFBEB', borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  ratingText: { fontSize: FontSize.sm, fontWeight: '700', color: '#92400E' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  location: { fontSize: FontSize.sm, color: Colors.textSecondary },
  reviewsLine: { fontSize: 12, color: Colors.textMuted, marginTop: 4, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  statItem: { alignItems: 'center', gap: 6 },
  statIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: 12, marginTop: 20 },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.secondary, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  amenityText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  roomCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.primary + '30',
  },
  roomLeft: { flex: 1 },
  roomName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  roomFeatures: { flexDirection: 'row', gap: 6 },
  roomFeatureTag: {
    backgroundColor: Colors.border, borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  roomFeatureText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  roomRight: { alignItems: 'flex-end' },
  roomPrice: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  perNight: { fontSize: 11, color: Colors.textMuted },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  footerPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  footerPerNight: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
});
