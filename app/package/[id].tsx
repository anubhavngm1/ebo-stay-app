import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';
import { dataApi } from '../../src/services/api';
import { Package } from '../../src/types';

const { width } = Dimensions.get('window');

export default function PackageDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.package(id);
        if (res.success && res.data) {
          setPkg(res.data);
        } else {
          setPkg({
            id: Number(id),
            title: 'Manali Trip Package',
            duration: '3 Nights / 4 Days',
            price: 6999,
            rating: 4.6,
            reviews_count: 120,
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
            description:
              'Enjoy a memorable trip to Manali with comfortable stay, meals, sightseeing and transport.',
            inclusions: [
              '3 Nights Stay',
              'Daily Breakfast & Dinner',
              'Sightseeing',
              'Transportation',
            ],
          });
        }
      } catch {
        setPkg({
          id: Number(id),
          title: 'Manali Trip Package',
          duration: '3 Nights / 4 Days',
          price: 6999,
          rating: 4.6,
          reviews_count: 120,
          image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
          description:
            'Enjoy a memorable trip to Manali with comfortable stay, meals, sightseeing and transport.',
          inclusions: [
            '3 Nights Stay',
            'Daily Breakfast & Dinner',
            'Sightseeing',
            'Transportation',
          ],
        });
      }
    })();
  }, [id]);

  if (!pkg) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri:
              pkg.image?.startsWith('http')
                ? pkg.image
                : `https://www.ebostay.com/assets/images/${pkg.image}`,
          }}
          style={styles.hero}
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{pkg.title}</Text>
          <Text style={styles.duration}>{pkg.duration || '3 Nights / 4 Days'}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={Colors.star} />
            <Text style={styles.rating}>
              {pkg.rating || 4.6} ({pkg.reviews_count || 120} Reviews)
            </Text>
          </View>

          <View style={styles.features}>
            {['Hotel', 'Meals', 'Sightseeing', 'Transport'].map((f) => (
              <View key={f} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.desc}>
            {pkg.description ||
              'Enjoy a memorable trip to Manali with comfortable stay, meals, sightseeing and transport.'}
          </Text>

          <Text style={styles.sectionTitle}>Inclusions</Text>
          {(pkg.inclusions || [
            '3 Nights Stay',
            'Daily Breakfast & Dinner',
            'Sightseeing',
            'Transportation',
          ]).map((inc, i) => (
            <View key={i} style={styles.inclusionRow}>
              <Ionicons name="checkmark" size={18} color={Colors.success} />
              <Text style={styles.inclusionText}>{inc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>₹{Number(pkg.price).toLocaleString('en-IN')}</Text>
          <Text style={styles.perPerson}>per person</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: '/booking/dates',
              params: { type: 'package', id: String(pkg.id), title: pkg.title },
            })
          }
          style={{ width: 160 }}
          fullWidth={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { width, height: 280 },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  duration: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  rating: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: FontSize.sm, color: Colors.text },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 10,
  },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  inclusionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  inclusionText: { fontSize: FontSize.md, color: Colors.text },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#fff',
  },
  price: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  perPerson: { fontSize: FontSize.xs, color: Colors.textMuted },
});
