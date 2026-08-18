import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Spacing, Radius } from '../src/constants/theme';
import Button from '../src/components/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover Amazing Destinations',
    desc: 'Explore the best hotels, resorts and holiday packages across India.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  },
  {
    id: '2',
    title: 'Easy Booking In Just Few Steps',
    desc: 'Book your stay in simple steps and enjoy a hassle-free experience.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
  },
  {
    id: '3',
    title: 'Secure Payments 100% Safe',
    desc: 'Your payments are secure with Razorpay and encryption.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
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
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Button
          title={index === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={next}
          style={{ width: 160 }}
          fullWidth={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skip: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: Radius.xl,
    marginBottom: 40,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
});
