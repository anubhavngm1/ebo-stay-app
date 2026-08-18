import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Spacing } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Simulate splash delay
        await new Promise((r) => setTimeout(r, 1800));

        const seenOnboarding = await SecureStore.getItemAsync('seen_onboarding');
        const token = await SecureStore.getItemAsync('user_session');

        if (!seenOnboarding) {
          router.replace('/onboarding');
        } else if (token) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch (e) {
        router.replace('/onboarding');
      } finally {
        setReady(true);
      }
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        }}
        style={styles.bgImage}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.85)', '#FFFFFF']}
        style={styles.gradient}
      />

      <View style={styles.logoBox}>
        <Text style={styles.logo}>EBO STAY</Text>
        <Text style={styles.palm}>🌴</Text>
      </View>

      <Text style={styles.tagline}>Travel | Stay | Explore</Text>
      <Text style={styles.sub}>Comfortable Stays,{'\n'}Memorable Journeys</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    position: 'absolute',
    width,
    height,
    opacity: 0.9,
  },
  gradient: {
    position: 'absolute',
    width,
    height,
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  palm: {
    fontSize: 28,
    marginLeft: 4,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  sub: {
    fontSize: FontSize.lg,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
});
