import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Spacing, Radius } from '../../src/constants/theme';
import Button from '../../src/components/Button';

const menuItems = [
  { icon: 'person-outline', label: 'Edit Profile' },
  { icon: 'heart-outline', label: 'Wishlist' },
  { icon: 'card-outline', label: 'Payment Methods' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'document-text-outline', label: 'Terms & Privacy' },
];

export default function ProfileScreen() {
  const router = useRouter();

  const logout = async () => {
    await SecureStore.deleteItemAsync('user_session');
    await SecureStore.deleteItemAsync('user_name');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.name}>Traveler</Text>
        <Text style={styles.phone}>+91 XXXXXXXXXX</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  phone: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  menu: {
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.text,
  },
});
