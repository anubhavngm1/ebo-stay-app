import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, Radius } from '../../src/constants/theme';
import PackageCard from '../../src/components/PackageCard';
import { dataApi } from '../../src/services/api';
import { Package } from '../../src/types';

const filters = ['All', 'Himachal', 'Goa', 'Kerala', 'Uttarakhand'];

export default function PackagesScreen() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const res = await dataApi.packages();
        if (res.success && res.data) {
          setPackages(Array.isArray(res.data) ? res.data : res.data.packages || []);
        } else {
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
            {
              id: 4,
              title: 'Uttarakhand Tour Package',
              duration: '4N / 5D',
              price: 8999,
              rating: 4.6,
              reviews_count: 98,
              image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            },
          ]);
        }
      } catch {
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
        ]);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Packages</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10, marginBottom: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === item && styles.filterActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={packages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <PackageCard item={item} onPress={() => router.push(`/package/${item.id}`)} />
        )}
      />
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
});
