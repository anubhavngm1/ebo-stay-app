import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, FontSize } from '../constants/theme';
import { Package } from '../types';

interface Props {
  item: Package;
  onPress: () => void;
  horizontal?: boolean;
}

export default function PackageCard({ item, onPress, horizontal }: Props) {
  const uri =
    item.image?.startsWith('http')
      ? item.image
      : item.image
      ? `https://www.ebostay.com/assets/images/${item.image}`
      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';

  const nights = item.nights ?? (item.duration?.match(/(\d+)N/)?.[1] ? Number(item.duration.match(/(\d+)N/)![1]) : 2);
  const duration = item.duration || `${nights}N / ${nights + 1}D`;
  const savings = item.original_price ? Math.round((1 - item.price / item.original_price) * 100) : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Image + overlays */}
      <View style={styles.imgWrap}>
        <Image source={{ uri }} style={styles.img} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Duration badge - bottom left */}
        <View style={styles.durationBadge}>
          <Ionicons name="moon-outline" size={11} color="#fff" />
          <Text style={styles.durationText}>{duration}</Text>
        </View>

        {/* Rating badge - top right */}
        {item.rating ? (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color="#FBBF24" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        ) : null}

        {/* Discount - top left */}
        {savings > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{savings}% OFF</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

        <View style={styles.bottomRow}>
          <View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{Number(item.price).toLocaleString('en-IN')}</Text>
              <Text style={styles.perPerson}>/person</Text>
            </View>
            {item.original_price ? (
              <Text style={styles.originalPrice}>
                ₹{Number(item.original_price).toLocaleString('en-IN')}
              </Text>
            ) : null}
          </View>

          <View style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>View</Text>
            <Ionicons name="arrow-forward" size={13} color={Colors.primary} />
          </View>
        </View>

        {item.reviews_count ? (
          <Text style={styles.reviews}>{item.reviews_count} reviews</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
  },
  imgWrap: {
    height: 190,
    position: 'relative',
  },
  img: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surface,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  durationText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  content: { padding: 14 },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  perPerson: { fontSize: 11, color: Colors.textMuted },
  originalPrice: {
    fontSize: 12,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.secondary,
  },
  bookBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  reviews: { fontSize: 11, color: Colors.textMuted, marginTop: 6 },
});
