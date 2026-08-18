import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, Radius } from '../../src/constants/theme';
import { dataApi } from '../../src/services/api';
import PackageCard from '../../src/components/PackageCard';
import { Package } from '../../src/types';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'hotels', name: 'Hotels', icon: 'bed' },
  { id: 'resorts', name: 'Resorts', icon: 'sunny' },
  { id: 'homestays', name: 'Homestays', icon: 'home' },
  { id: 'villas', name: 'Villas', icon: 'business' },
];

const destinations = [
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=300' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greetName, setGreetName] = useState('there');

  const loadData = async () => {
    try {
      const res = await dataApi.packages({ limit: 6 });
      if (res.success && res.data) {
        setPackages(Array.isArray(res.data) ? res.data : res.data.packages || []);
      } else {
        // Fallback sample data matching UI
        setPackages([
          {
            id: 1,
            title: 'Manali Trip Package',
            duration: '2N / 3D',
            price: 6999,
            rating: 4.6,
            reviews_count: 120,
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400',
          },
          {
            id: 2,
            title: 'Goa Beach Package',
            duration: '2N / 3D',
            price: 4999,
            rating: 4.5,
            reviews_count: 89,
            image: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=400',
          },
          {
            id: 3,
            title: 'Kerala Backwater Package',
            duration: '3N / 4D',
            price: 7499,
            rating: 4.7,
            reviews_count: 156,
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400',
          },
        ]);
      }
    } catch (e) {
      setPackages([
        {
          id: 1,
          title: 'Manali Trip Package',
          duration: '2N / 3D',
          price: 6999,
          rating: 4.6,
          reviews_count: 120,
          image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400',
        },
        {
          id: 2,
          title: 'Goa Beach Package',
          duration: '2N / 3D',
          price: 4999,
          rating: 4.5,
          reviews_count: 89,
          image: 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?w=400',
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    (async () => {
      const session = await SecureStore.getItemAsync('user_session');
      const n = await SecureStore.getItemAsync('user_name');
      if (session === '1' && n) setGreetName(n);
      else setGreetName('there');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {greetName} 👋</Text>
            <Text style={styles.question}>Where do you want to go?</Text>
          </View>
          <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={styles.searchBox}
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/offers')}
        >
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search places, hotels, packages...</Text>
        </TouchableOpacity>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.banner} activeOpacity={0.9}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>UPTO 30% OFF</Text>
            <Text style={styles.bannerSub}>On Summer Packages</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Book Now</Text>
            </View>
          </View>
          <Text style={styles.bannerEmoji}>🌴</Text>
        </TouchableOpacity>

        {/* Top Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Categories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categories}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catItem}
                onPress={() => router.push('/hotels')}
              >
                <View style={styles.catIcon}>
                  <Ionicons name={cat.icon as any} size={22} color={Colors.primary} />
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {destinations.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={styles.destCard}
                onPress={() => router.push({ pathname: '/hotels', params: { dest: d.name } })}
              >
                <Image source={{ uri: d.image }} style={styles.destImage} />
                <Text style={styles.destName}>{d.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Packages */}
        <View style={[styles.section, { paddingBottom: 30 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Packages</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/offers')}>
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
          </View>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              item={pkg}
              onPress={() => router.push(`/package/${pkg.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  question: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  searchPlaceholder: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  banner: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.md,
    marginTop: 4,
  },
  bannerBtn: {
    marginTop: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  bannerBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  bannerEmoji: {
    fontSize: 56,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  viewAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catItem: {
    alignItems: 'center',
    width: (width - 40 - 36) / 4,
  },
  catIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  destCard: {
    marginRight: 14,
    width: 120,
  },
  destImage: {
    width: 120,
    height: 90,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  destName: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
});
