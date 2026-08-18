import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';

const methods = [
  { id: 'razorpay', name: 'Razorpay', desc: 'Cards, UPI, Wallets, Netbanking', icon: 'card' },
  { id: 'upi', name: 'UPI', desc: 'Pay using any UPI app', icon: 'phone-portrait' },
  { id: 'cards', name: 'Cards', desc: 'Visa, Mastercard, Rupay', icon: 'card-outline' },
  { id: 'netbanking', name: 'Netbanking', desc: 'All major banks supported', icon: 'business' },
  { id: 'wallets', name: 'Wallets', desc: 'Paytm, PhonePe, Amazon Pay & more', icon: 'wallet' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const total = Number(params.total || 10617);
  const [selected, setSelected] = useState('razorpay');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>

      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>₹{total.toLocaleString('en-IN')}</Text>
      </View>

      <Text style={styles.section}>Recommended</Text>

      {methods.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.method, selected === m.id && styles.methodActive]}
          onPress={() => setSelected(m.id)}
        >
          <View style={styles.methodIcon}>
            <Ionicons name={m.icon as any} size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodName}>{m.name}</Text>
            <Text style={styles.methodDesc}>{m.desc}</Text>
          </View>
          <View style={[styles.radio, selected === m.id && styles.radioActive]}>
            {selected === m.id && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ flex: 1 }} />

      <View style={styles.footer}>
        <Button
          title={`Pay ₹${total.toLocaleString('en-IN')} Securely`}
          onPress={() =>
            router.replace({
              pathname: '/booking/confirmed',
              params: { bookingId: 'EBO' + Math.floor(Math.random() * 900000 + 100000) },
            })
          }
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
  amountBox: {
    marginHorizontal: 20,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  amount: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginTop: 4 },
  section: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 10,
    gap: 12,
  },
  methodActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.secondary,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  methodDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  footer: { padding: 20 },
});
