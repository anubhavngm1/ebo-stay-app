import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';
import { dataApi } from '../../src/services/api';
import { Package } from '../../src/types';

const { width } = Dimensions.get('window');

export default function PackageDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const res = await dataApi.package(id);
        if (!live) return;
        if (res?.success && res.data) setPkg(res.data);
        else setPkg({
          id: Number(id) || 1, title: 'Holiday Package', duration: '3 Nights / 4 Days',
          price: 6999, rating: 4.5, reviews_count: 40,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          description: 'Memorable trip with stay, meals and sightseeing.',
          inclusions: ['Stay', 'Meals', 'Sightseeing', 'Transport'],
        });
      } catch {
        if (!live) return;
        setPkg({
          id: Number(id) || 1, title: 'Holiday Package', duration: '3 Nights / 4 Days',
          price: 6999, rating: 4.5,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          description: 'Unable to load full details. You can still continue booking.',
          inclusions: ['Stay', 'Meals', 'Sightseeing'],
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
        <Text style={styles.hint}>Loading package...</Text>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>Package not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 16, width: 160 }} fullWidth={false} />
      </View>
    );
  }

  const imageUri = pkg.image?.startsWith('http') ? pkg.image : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: imageUri }} style={styles.hero} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>{pkg.title}</Text>
          <Text style={styles.duration}>{pkg.duration || '3 Nights / 4 Days'}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={Colors.star} />
            <Text style={styles.rating}>{pkg.rating || 4.5} ({pkg.reviews_count || 0} Reviews)</Text>
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
          <Text style={styles.desc}>{pkg.description || 'Enjoy a memorable trip.'}</Text>
          <Text style={styles.sectionTitle}>Inclusions</Text>
          {(pkg.inclusions || ['Stay', 'Meals', 'Sightseeing', 'Transport']).map((inc, i) => (
            <View key={i} style={styles.inclusionRow}>
              <Ionicons name="checkmark" size={18} color={Colors.success} />
              <Text style={styles.inclusionText}>{inc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>₹{Number(pkg.price || 0).toLocaleString('en-IN')}</Text>
          <Text style={styles.perPerson}>per person</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: '/booking/dates',
              params: { type: 'package', id: String(pkg.id), title: pkg.title, price: String(pkg.price) },
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 },
  hint: { marginTop: 12, color: Colors.textSecondary },
  hero: { width, height: 280, backgroundColor: Colors.surface },
  backBtn: {
    position: 'absolute', top: 50, left: 16, width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  duration: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  rating: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: FontSize.sm, color: Colors.text },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginTop: 24, marginBottom: 10 },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  inclusionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  inclusionText: { fontSize: FontSize.md, color: Colors.text },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: '#fff',
  },
  price: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  perPerson: { fontSize: FontSize.xs, color: Colors.textMuted },
});
