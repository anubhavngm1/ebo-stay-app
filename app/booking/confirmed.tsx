import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your booking has been confirmed{'\n'}and we have sent the details to{'\n'}your email &
          phone.
        </Text>

        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Booking ID</Text>
          <Text style={styles.idValue}>{bookingId || 'EBO123456'}</Text>
        </View>

        <View style={styles.illustration}>
          <Text style={{ fontSize: 64 }}>🧳🌴</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="View Booking"
          onPress={() => router.replace('/(tabs)/bookings')}
          style={{ marginBottom: 12 }}
        />
        <Button
          title="Go to Home"
          variant="outline"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  idBox: {
    marginTop: 28,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  idLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  idValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
  },
  illustration: { marginTop: 32 },
  footer: { padding: 24 },
});
