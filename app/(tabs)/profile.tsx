import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(true);
  const [name, setName] = useState('Guest');
  const [phone, setPhone] = useState('');

  const load = useCallback(async () => {
    const session = await SecureStore.getItemAsync('user_session');
    const n = await SecureStore.getItemAsync('user_name');
    const p = await SecureStore.getItemAsync('user_phone');
    const cid = await SecureStore.getItemAsync('customer_id');

    if (session === '1' && (cid || n)) {
      setIsGuest(false);
      setName(n || 'User');
      setPhone(p || '');
    } else {
      setIsGuest(true);
      setName('Guest');
      setPhone('');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const logout = async () => {
    await SecureStore.deleteItemAsync('user_session');
    await SecureStore.deleteItemAsync('user_name');
    await SecureStore.deleteItemAsync('user_phone');
    await SecureStore.deleteItemAsync('customer_id');
    router.replace('/login');
  };

  const goLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.name}>{name}</Text>
        {isGuest ? (
          <Text style={styles.guestBadge}>Browsing as Guest</Text>
        ) : phone ? (
          <Text style={styles.phone}>{phone}</Text>
        ) : null}
      </View>

      {isGuest ? (
        <View style={styles.guestCard}>
          <Text style={styles.guestTitle}>Login to unlock full features</Text>
          <Text style={styles.guestSub}>Bookings, wishlist, offers & more</Text>
          <Button title="Login / Sign Up" onPress={goLogin} style={{ marginTop: 16 }} />
        </View>
      ) : (
        <>
          <View style={styles.menu}>
            {[
              { icon: 'person-outline', label: 'Edit Profile' },
              { icon: 'heart-outline', label: 'Wishlist' },
              { icon: 'card-outline', label: 'Payment Methods' },
              { icon: 'help-circle-outline', label: 'Help & Support' },
              { icon: 'document-text-outline', label: 'Terms & Privacy' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <Ionicons name={item.icon as any} size={22} color={Colors.text} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title="Logout"
            onPress={logout}
            variant="outline"
            style={{ marginHorizontal: 20, marginTop: 24 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    fontSize: 24, fontWeight: '800', color: Colors.text,
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
  },
  avatarBox: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  phone: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  guestBadge: {
    marginTop: 6, fontSize: 13, color: Colors.primary, fontWeight: '600',
    backgroundColor: Colors.secondary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
    overflow: 'hidden',
  },
  guestCard: {
    marginHorizontal: 20, padding: 24, borderRadius: Radius.lg,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  guestTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  guestSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 6, textAlign: 'center' },
  menu: {
    marginHorizontal: 20, backgroundColor: Colors.card, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 14,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.text },
});
