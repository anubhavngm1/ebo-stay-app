import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';

export default function SelectDatesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [checkIn] = useState('20 May 2024');
  const [checkOut] = useState('23 May 2024');
  const [guests] = useState('2 Adults • 1 Room');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Dates & Guests</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.value}>{checkIn}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.col}>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.value}>{checkOut}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Guests & Rooms</Text>
            <Text style={styles.value}>{guests}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.footer}>
        <Button
          title={params.type === 'hotel' ? 'Search Hotels' : 'Continue'}
          onPress={() =>
            router.push({
              pathname: '/booking/details',
              params: {
                ...params,
                checkIn,
                checkOut,
                guests,
              },
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
    paddingBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  card: {
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  row: { flexDirection: 'row' },
  col: { flex: 1 },
  divider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6 },
  value: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  edit: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  footer: { padding: 20 },
});
