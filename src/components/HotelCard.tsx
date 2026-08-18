import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSize } from '../constants/theme';
import { Hotel } from '../types';

interface Props {
  item: Hotel;
  onPress: () => void;
}

export default function HotelCard({ item, onPress }: Props) {
  const uri =
    item.image?.startsWith('http')
      ? item.image
      : item.image
      ? `https://www.ebostay.com/assets/images/${item.image}`
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

  const rating = Number(item.rating || item.star_rating || 4.2).toFixed(1);
  const price = Number(item.price_per_night || 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Thumbnail */}
      <View style={styles.imgWrap}>
        <Image source={{ uri }} style={styles.img} contentFit="cover" />
        {/* Rating overlay on image */}
        <View style={styles.ratingOverlay}>
          <Ionicons name="star" size={10} color="#FBBF24" />
          <Text style={styles.ratingOverlayText}>{rating}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {item.location || item.city || 'India'}
          </Text>
        </View>

        {item.amenities && item.amenities.length > 0 && (
          <View style={styles.amenitiesRow}>
            {item.amenities.slice(0, 3).map((a) => (
              <View key={a} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>
              ₹{price > 0 ? price.toLocaleString('en-IN') : '—'}
            </Text>
            <Text style={styles.perNight}>per night</Text>
          </View>
          <View style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Book</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imgWrap: { width: 112, position: 'relative' },
  img: { width: 112, height: '100%', backgroundColor: Colors.surface },
  ratingOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingOverlayText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { flex: 1, padding: 12, justifyContent: 'space-between', minHeight: 110 },
  name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  location: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  amenitiesRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginBottom: 8 },
  amenityTag: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  amenityText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  perNight: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bookBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
