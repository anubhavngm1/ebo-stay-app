import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSize, Spacing } from '../constants/theme';
import { Package } from '../types';

interface Props {
  item: Package;
  onPress: () => void;
}

export default function PackageCard({ item, onPress }: Props) {
  const imageUri =
    item.image && item.image.startsWith('http')
      ? item.image
      : item.image
      ? `https://www.ebostay.com/assets/images/${item.image}`
      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.duration}>
          {item.duration || `${item.nights || 2}N / ${(item.nights || 2) + 1}D`}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>₹{Number(item.price).toLocaleString('en-IN')}</Text>
          <Text style={styles.perPerson}>per person</Text>
        </View>
        {item.rating ? (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.star} />
            <Text style={styles.rating}>
              {item.rating} ({item.reviews_count || 0})
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  duration: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
  },
  perPerson: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  rating: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
