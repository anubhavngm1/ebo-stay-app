import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Radius } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover\nAmazing Stays',
    desc: 'Explore handpicked hotels, resorts and holiday packages across India\'s finest destinations.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    accent: '#0D9488',
  },
  {
    id: '2',
    title: 'Book in\nSeconds',
    desc: 'From choosing your dates to checkout — everything is smooth, fast and hassle-free.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    accent: '#0F766E',
  },
  {
    id: '3',
    title: '100% Safe\n& Secure',
    desc: 'Your payments are protected by Razorpay encryption. Book with complete confidence.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    accent: '#134E4A',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const finish = async () => {
    await SecureStore.setItemAsync('seen_onboarding', '1');
    router.replace('/login');
  };

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  const isLast = index === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']}
              locations={[0.25, 0.6, 1]}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      />

      {/* Skip */}
      <TouchableOpacity style={styles.skip} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Bottom content overlay */}
      <View style={styles.bottom}>
        <Text style={styles.title}>{slides[index].title}</Text>
        <Text style={styles.desc}>{slides[index].desc}</Text>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.nextBtn, isLast && styles.getStartedBtn]}
          onPress={next}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>{isLast ? 'Get Started' : 'Next  →'}</Text>
        </TouchableOpacity>

        {isLast && (
          <TouchableOpacity style={styles.guestBtn} onPress={finish}>
            <Text style={styles.guestText}>Browse as Guest</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  skip: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 56,
    right: 24,
    zIndex: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.full,
  },
  skipText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'android' ? 40 : 52,
    paddingTop: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 44,
    marginBottom: 14,
  },
  desc: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  dotActive: {
    width: 28,
    backgroundColor: Colors.primaryLight,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  nextBtn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  getStartedBtn: {
    backgroundColor: Colors.primary,
  },
  nextText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  guestText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
