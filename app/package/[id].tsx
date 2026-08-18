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
import { Package } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const FALLBACK: Package = {
  id: 0, title: 'Manali Hill Escape', duration: '3 Nights / 4 Days', price: 6999,
  rating: 4.6, reviews_count: 120,
  image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  description: 'Experience the magic of Manali with our all-inclusive package — cosy stays, scenic drives and mountain adventures.',
  inclusions: ['3 Nights Hotel Stay', 'Daily Breakfast & Dinner', 'Airport Transfers', 'Sightseeing', 'Tour Guide'],
};

const HIGHLIGHTS = [
  { icon: 'bed-outline', label: 'Hotel' },
  { icon: 'restaurant-outline', label: 'Meals' },
  { icon: 'binoculars-outline', label: 'Sightseeing' },
  { icon: 'car-outline', label: 'Transport' },
];

export default function PackageDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.package(id);
        setPkg(res?.success && res.data ? res.data : { ...FALLBACK, id: Number(id) });
      } catch {
        setPkg({ ...FALLBACK, id: Number(id) });
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

  if (!pkg) return null;

  const imgUri = pkg.image?.startsWith('http')
    ? pkg.image
    : `https://www.ebostay.com/assets/images/${pkg.image}`;

  const nights = pkg.nights ?? 2;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: imgUri }} style={styles.hero} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.35)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.wishBtn} onPress={() => setWishlisted((w) => !w)}>
            <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={22} color={wishlisted ? '#EF4444' : '#fff'} />
          </TouchableOpacity>
          <View style={styles.heroDuration}>
            <Ionicons name="moon-outline" size={13} color="#fff" />
            <Text style={styles.heroDurationText}>{pkg.duration || `${nights}N / ${nights + 1}D`}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{pkg.title}</Text>
            {pkg.rating ? (
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingText}>{pkg.rating}</Text>
              </View>
            ) : null}
          </View>
          {pkg.reviews_count ? (
            <Text style={styles.reviews}>{pkg.reviews_count} verified reviews</Text>
          ) : null}

          <View style={styles.highlightsRow}>
            {HIGHLIGHTS.map((h) => (
              <View key={h.label} style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <Ionicons name={h.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.highlightLabel}>{h.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.desc}>{pkg.description || FALLBACK.description}</Text>

          <Text style={styles.sectionTitle}>What&apos;s Included</Text>
          <View style={styles.inclusionList}>
            {(pkg.inclusions || FALLBACK.inclusions!).map((inc, i) => (
              <View key={i} style={styles.inclusionRow}>
                <View style={styles.inclusionDot}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
                <Text style={styles.inclusionText}>{inc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.noteBox}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.noteText}>
              Airfare, personal expenses & optional activities not included.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₹{Number(pkg.price).toLocaleString('en-IN')}</Text>
          <Text style={styles.perPerson}>per person · incl. taxes</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: '/booking/dates',
              params: { type: 'package', id: String(pkg.id), title: pkg.title, price: String(pkg.price) },
            })
          }
          style={{ width: 150 }}
          fullWidth={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroWrap: { height: 290, position: 'relative' },
  hero: { width, height: 290 },
  backBtn: {
    position: 'absolute', top: 50, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  wishBtn: {
    position: 'absolute', top: 50, right: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  heroDuration: {
    position: 'absolute', bottom: 14, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  heroDurationText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 110 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: Colors.text },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFBEB', borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  ratingText: { fontSize: FontSize.sm, fontWeight: '700', color: '#92400E' },
  reviews: { fontSize: 12, color: Colors.textMuted, marginTop: 6, marginBottom: 20 },
  highlightsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Colors.secondary, borderRadius: Radius.lg,
    padding: 16, marginBottom: 4,
  },
  highlightItem: { alignItems: 'center', gap: 6 },
  highlightIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  highlightLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginTop: 22, marginBottom: 10 },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  inclusionList: { gap: 10 },
  inclusionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inclusionDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center',
  },
  inclusionText: { fontSize: FontSize.md, color: Colors.text, flex: 1 },
  noteBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginTop: 20, padding: 14,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  noteText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  footerPrice: { fontSize: 22, fontWeight: '900', color: Colors.primary },
  perPerson: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
});
