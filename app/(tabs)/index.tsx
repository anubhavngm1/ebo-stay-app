import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Colors, FontSize, Radius, Spacing } from '../../src/constants/theme';
import { dataApi } from '../../src/services/api';
import PackageCard from '../../src/components/PackageCard';
import { Package } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'hotels', label: 'Hotels', icon: 'bed-outline', bg: '#F0FDF4', color: '#16A34A' },
  { id: 'resorts', label: 'Resorts', icon: 'sunny-outline', bg: '#FFF7ED', color: '#EA580C' },
  { id: 'homestays', label: 'Homestays', icon: 'home-outline', bg: '#EFF6FF', color: '#2563EB' },
  { id: 'villas', label: 'Villas', icon: 'business-outline', bg: '#FDF4FF', color: '#9333EA' },
];

const destinations = [
  { name: 'Manali', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300' },
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=300' },
  { name: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300' },
  { name: 'Leh', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300' },
];

const FALLBACK_PACKAGES: Package[] = [
  { id: 1, title: 'Manali Hill Escape', duration: '2N / 3D', price: 6999, rating: 4.6, reviews_count: 120, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400' },
  { id: 2, title: 'Goa Beach Holiday', duration: '2N / 3D', price: 4999, rating: 4.5, reviews_count: 89, image: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=400' },
  { id: 3, title: 'Kerala Backwaters', duration: '3N / 4D', price: 7499, rating: 4.7, reviews_count: 156, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [isGuest, setIsGuest] = useState(true);

  // Re-check auth on focus (e.g. after login)
  useFocusEffect(useCallback(() => {
    (async () => {
      const session = await SecureStore.getItemAsync('user_session');
      const name = await SecureStore.getItemAsync('user_name');
      setIsGuest(session !== '1');
      setUserName(name || '');
    })();
  }, []));

  const loadData = async () => {
    try {
      const res = await dataApi.packages({ limit: 4 });
      if (res?.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.packages || [];
        setPackages(list.length > 0 ? list : FALLBACK_PACKAGES);
      } else {
        setPackages(FALLBACK_PACKAGES);
      }
    } catch {
      setPackages(FALLBACK_PACKAGES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const greeting = isGuest
    ? 'Hi, Guest 👋'
    : `Hi, ${userName.split(' ')[0] || 'there'} 👋`;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={Colors.primary}
            onRefresh={() => { setRefreshing(true); loadData(); }}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.question}>Where do you want to go?</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={styles.searchBox}
          activeOpacity={0.85}
          onPress={() => router.push('/hotels')}
        >
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <Text style={styles.searchText}>Search places, hotels, packages…</Text>
          <View style={styles.searchFilter}>
            <Ionicons name="options-outline" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Promo Banner */}
        <TouchableOpacity activeOpacity={0.92} style={styles.bannerWrap}>
          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>🔥 Limited Offer</Text>
              </View>
              <Text style={styles.bannerTitle}>UPTO 30% OFF</Text>
              <Text style={styles.bannerSub}>On all Summer Packages</Text>
              <TouchableOpacity
                style={styles.bannerCta}
                onPress={() => router.push('/(tabs)/offers')}
              >
                <Text style={styles.bannerCtaText}>Explore Deals</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerRight}>
              <Text style={{ fontSize: 52 }}>🏖️</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Type</Text>
            <TouchableOpacity onPress={() => router.push('/hotels')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.catGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                activeOpacity={0.8}
                onPress={() => router.push('/hotels')}
              >
                <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <Text style={styles.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {destinations.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={styles.destCard}
                activeOpacity={0.88}
                onPress={() => router.push({ pathname: '/hotels', params: { dest: d.name } })}
              >
                <Image source={{ uri: d.img }} style={styles.destImg} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.62)']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.destName}>{d.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Packages */}
        <View style={[styles.section, { paddingBottom: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Packages</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/offers')}>
              <Text style={styles.viewAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          ) : (
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                item={pkg}
                onPress={() => router.push(`/package/${pkg.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  question: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 2 },
  bellBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchText: { flex: 1, color: Colors.textMuted, fontSize: FontSize.sm },
  searchFilter: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  bannerWrap: { marginHorizontal: 20, marginBottom: 24, borderRadius: Radius.xl, overflow: 'hidden' },
  banner: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    marginBottom: 10,
  },
  bannerBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bannerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', lineHeight: 30 },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, marginTop: 4 },
  bannerCta: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  bannerCtaText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  bannerRight: { marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  section: { paddingHorizontal: 20, marginBottom: 6 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  viewAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  catGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  catCard: { alignItems: 'center', width: (width - 56) / 4 },
  catIcon: {
    width: 58, height: 58, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  catLabel: { fontSize: 11, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  destCard: {
    width: 130, height: 100,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  destImg: { ...StyleSheet.absoluteFillObject },
  destName: {
    color: '#fff', fontSize: FontSize.sm,
    fontWeight: '700', padding: 10,
  },
});
