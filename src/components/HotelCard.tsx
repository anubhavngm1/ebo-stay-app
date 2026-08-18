import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSize, Spacing } from '../constants/theme';
import { Hotel } from '../types';

interface Props {
  item: Hotel;
  onPress: () => void;
}

export default function HotelCard({ item, onPress }: Props) {
  const imageUri =
    item.image && item.image.startsWith('http')
      ? item.image
      : item.image
      ? `https://www.ebostay.com/assets/images/${item.image}`
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

  const rating = item.rating || item.star_rating || 4.2;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color={Colors.star} />
            <Text style={styles.ratingText}>
              {rating} {item.reviews_count ? `(${item.reviews_count})` : ''}
            </Text>
          </View>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {item.location || item.city || 'India'}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ₹{Number(item.price_per_night || 0).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.perNight}>per night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  location: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 6,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  perNight: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
