import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';

const authedMenu = [
  { icon: 'person-circle-outline', label: 'Edit Profile', badge: null },
  { icon: 'heart-outline', label: 'My Wishlist', badge: null },
  { icon: 'ticket-outline', label: 'My Coupons', badge: '2' },
  { icon: 'card-outline', label: 'Payment Methods', badge: null },
  { icon: 'help-circle-outline', label: 'Help & Support', badge: null },
  { icon: 'document-text-outline', label: 'Terms & Privacy', badge: null },
  { icon: 'information-circle-outline', label: 'About EBO Stay', badge: null },
];

const guestMenu = [
  { icon: 'help-circle-outline', label: 'Help & Support', badge: null },
  { icon: 'document-text-outline', label: 'Terms & Privacy', badge: null },
  { icon: 'information-circle-outline', label: 'About EBO Stay', badge: null },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading, userName, userPhone } = useAuth();

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('user_session');
          await SecureStore.deleteItemAsync('user_name');
          await SecureStore.deleteItemAsync('user_phone');
          await SecureStore.deleteItemAsync('customer_id');
          router.replace('/login');
        },
      },
    ]);
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  const displayName = userName || (isLoggedIn ? 'EBO Traveler' : 'Guest User');
  const displayPhone = userPhone || (isLoggedIn ? '' : 'Login to access all features');
  const initial = displayName.charAt(0).toUpperCase();
  const menuItems = isLoggedIn ? authedMenu : guestMenu;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header gradient */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.headerGrad}
        >
          {/* Avatar */}
          <View style={styles.avatarCircle}>
            {isLoggedIn ? (
              <Text style={styles.avatarInitial}>{initial}</Text>
            ) : (
              <Ionicons name="person" size={36} color={Colors.primary} />
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          {displayPhone ? (
            <Text style={styles.phone}>{displayPhone}</Text>
          ) : null}

          {isLoggedIn && (
            <View style={styles.memberBadge}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.memberText}>Member</Text>
            </View>
          )}
        </LinearGradient>

        {/* Guest CTA */}
        {!isLoggedIn && (
          <View style={styles.guestCta}>
            <Text style={styles.guestCtaTitle}>Login to unlock everything</Text>
            <Text style={styles.guestCtaDesc}>
              View bookings, save wishlists, get exclusive offers and manage your trips.
            </Text>
            <Button
              title="Login / Sign Up"
              onPress={() => router.push('/login')}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* Stats row (logged in) */}
        {isLoggedIn && (
          <View style={styles.statsRow}>
            {[
              { label: 'Trips', value: '3' },
              { label: 'Reviews', value: '5' },
              { label: 'Points', value: '240' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.version}>EBO Stay v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  headerGrad: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarInitial: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  name: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  phone: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  memberText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  guestCta: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guestCtaTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  guestCtaDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1, alignItems: 'center', paddingVertical: 16,
    borderRightWidth: 1, borderRightColor: Colors.border,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
  menuCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.text },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF5F5',
  },
  logoutText: { fontSize: FontSize.md, color: Colors.error, fontWeight: '600' },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    paddingBottom: 32,
    marginTop: -4,
  },
});
