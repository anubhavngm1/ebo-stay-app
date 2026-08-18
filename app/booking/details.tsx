import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = (params.title as string) || 'The Manali Inn';
  const price = Number(params.price || 2999);
  const nights = 3;
  const roomCharges = price * nights;
  const taxes = Math.round(roomCharges * 0.18);
  const total = roomCharges + taxes;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Booking Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.hotelRow}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
            }}
            style={styles.thumb}
          />
          <View>
            <Text style={styles.hotelName}>{title}</Text>
            <Text style={styles.loc}>Manali, Himachal Pradesh</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.value}>{params.checkIn || '20 May 2024'}</Text>
          </View>
          <View>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.value}>{params.checkOut || '23 May 2024'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.label}>Guests & Rooms</Text>
            <Text style={styles.value}>{params.guests || '2 Adults • 1 Room'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Room Charges ({nights} Nights)</Text>
          <Text style={styles.priceValue}>₹{roomCharges.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Taxes & Fees</Text>
          <Text style={styles.priceValue}>₹{taxes.toLocaleString('en-IN')}</Text>
        </View>
        <View style={[styles.priceRow, { marginTop: 8 }]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₹{total.toLocaleString('en-IN')}</Text>
          <Text style={styles.viewDetails}>View Price Details</Text>
        </View>
        <Button
          title="Continue to Payment"
          onPress={() =>
            router.push({
              pathname: '/booking/payment',
              params: { ...params, total: String(total) },
            })
          }
          style={{ width: 180 }}
          fullWidth={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  card: {
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  hotelRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 60, height: 60, borderRadius: 10 },
  hotelName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  loc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary },
  value: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  priceValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  totalLabel: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  totalValue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  viewDetails: { fontSize: 11, color: Colors.primary, marginTop: 2 },
});
