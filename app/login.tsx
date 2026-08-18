import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../src/constants/theme';
import Button from '../src/components/Button';
import { authApi } from '../src/services/api';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const clean = phone.replace(/\s/g, '');
    if (clean.length < 10) return;
    setLoading(true);
    const fullPhone = clean.startsWith('+91') ? clean : `+91${clean}`;
    try {
      await authApi.phoneSendOtp(fullPhone);
    } catch { /* continue anyway */ }
    router.push({ pathname: '/otp', params: { phone: fullPhone } });
    setLoading(false);
  };

  const skipAsGuest = async () => {
    await SecureStore.deleteItemAsync('user_session');
    await SecureStore.deleteItemAsync('user_name');
    await SecureStore.deleteItemAsync('user_phone');
    await SecureStore.deleteItemAsync('customer_id');
    router.replace('/(tabs)');
  };

  const isValid = phone.replace(/\s/g, '').length === 10;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Teal header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary, '#14B8A6']}
          style={styles.header}
        >
          <View style={styles.logoRow}>
            <Text style={styles.logo}>EBO</Text>
            <View style={styles.logoDot} />
            <Text style={styles.logoStay}>STAY</Text>
          </View>
          <Text style={styles.headerSub}>Comfortable Stays, Memorable Journeys</Text>
        </LinearGradient>

        {/* White form card */}
        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>

          {/* Google SSO placeholder */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={18} color="#DB4437" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or use mobile</Text>
            <View style={styles.orLine} />
          </View>

          {/* Phone input */}
          <View style={[styles.phoneBox, phone.length > 0 && styles.phoneBoxActive]}>
            <View style={styles.prefixBox}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.prefix}>+91</Text>
            </View>
            <View style={styles.phoneDivider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="10-digit mobile number"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              autoFocus={false}
            />
            {isValid && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            )}
          </View>

          <Button
            title="Get OTP →"
            onPress={sendOtp}
            loading={loading}
            disabled={!isValid}
            style={{ marginTop: 20 }}
          />

          {/* Trust badges */}
          <View style={styles.trustRow}>
            {[
              { icon: 'shield-checkmark-outline', label: 'Secure OTP' },
              { icon: 'lock-closed-outline', label: 'No Spam' },
              { icon: 'flash-outline', label: 'Instant Login' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Ionicons name={t.icon as any} size={16} color={Colors.primary} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>

          {/* Guest option */}
          <TouchableOpacity style={styles.guestRow} onPress={skipAsGuest} activeOpacity={0.7}>
            <Text style={styles.guestText}>Browse as Guest</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' & '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: {
    paddingTop: Platform.OS === 'android' ? 52 : 64,
    paddingBottom: 36,
    paddingHorizontal: 28,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logo: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  logoDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: 3, marginTop: 4,
  },
  logoStay: { fontSize: 32, fontWeight: '300', color: 'rgba(255,255,255,0.88)', letterSpacing: 3 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  form: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -4,
  },
  formContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 28 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 10,
    backgroundColor: '#fff',
  },
  googleText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 22, gap: 10 },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '500' },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    height: 56,
    paddingRight: 14,
    backgroundColor: Colors.surface,
  },
  phoneBoxActive: { borderColor: Colors.primary, backgroundColor: '#fff' },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
  },
  flag: { fontSize: 18 },
  prefix: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  phoneDivider: { width: 1, height: 28, backgroundColor: Colors.border, marginRight: 12 },
  phoneInput: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
  },
  trustItem: { alignItems: 'center', gap: 4 },
  trustLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 18,
  },
  guestText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  terms: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 17 },
  termsLink: { color: Colors.primary, fontWeight: '600' },
});
