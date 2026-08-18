import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import { dataApi } from '../../src/services/api';
import { Package } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

const FILTERS = ['All', 'Himachal', 'Goa', 'Kerala', 'Uttarakhand'];

export default function PackagesScreen() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.packages();
        if (res?.success && res.data) {
          setPackages(Array.isArray(res.data) ? res.data : []);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const filtered =
    filter === 'All'
      ? packages
      : packages.filter((p) =>
          `${p.title} ${p.destination_name || ''}`.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.top}>
        <Text style={styles.header}>Packages</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const uri = item.image?.startsWith('http')
              ? item.image
              : item.image
              ? `https://www.ebostay.com/assets/images/${item.image}`
              : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => router.push(`/package/${item.id}`)}
              >
                <View style={styles.imgWrap}>
                  <Image source={{ uri }} style={styles.img} contentFit="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.45)']} style={StyleSheet.absoluteFill} />
                  <View style={styles.dur}>
                    <Ionicons name="moon-outline" size={11} color="#fff" />
                    <Text style={styles.durText}>{item.duration || '3N / 4D'}</Text>
                  </View>
                </View>
                <View style={styles.body}>
                  <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.meta}>
                    <Text style={styles.price}>₹{Number(item.price || 0).toLocaleString('en-IN')}</Text>
                    <Text style={styles.pp}>/person</Text>
                    {item.rating ? (
                      <View style={styles.rate}>
                        <Ionicons name="star" size={11} color="#FBBF24" />
                        <Text style={styles.rateText}>{item.rating}</Text>
                      </View>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => router.push(`/package/${item.id}`)}
                  >
                    <Text style={styles.viewText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 40 }}>
              No packages found
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  top: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8,
  },
  header: { fontSize: 24, fontWeight: '800', color: Colors.text },
  chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  imgWrap: { height: 160, position: 'relative' },
  img: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.surface },
  dur: {
    position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  durText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  body: { padding: 14 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  pp: { fontSize: 12, color: Colors.textMuted, marginLeft: 2 },
  rate: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 'auto' },
  rateText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  viewBtn: {
    alignSelf: 'flex-start', borderWidth: 1.5, borderColor: Colors.primary,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
  },
  viewText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
});
