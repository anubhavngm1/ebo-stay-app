import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, Radius } from '../src/constants/theme';
import Button from '../src/components/Button';
import { authApi } from '../src/services/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid', 'Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      const res = await authApi.phoneSendOtp(fullPhone);
      if (res.success) {
        router.push({ pathname: '/otp', params: { phone: fullPhone } });
      } else {
        // Even if API fails due to CORS/session, proceed for demo
        router.push({ pathname: '/otp', params: { phone: fullPhone } });
      }
    } catch (e) {
      // Backend CORS may block, still allow flow for UI demo
      router.push({ pathname: '/otp', params: { phone: `+91${phone}` } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue your journey</Text>

        {/* Google button (UI only for now) */}
        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.phoneBox}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Button title="Get OTP" onPress={sendOtp} loading={loading} style={{ marginTop: 24 }} />

        <TouchableOpacity style={styles.signupRow} onPress={() => {}}>
          <Text style={styles.signupText}>
            New here? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: 36,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 10,
  },
  googleText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  or: {
    marginHorizontal: 16,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    height: 52,
    paddingHorizontal: 16,
  },
  prefix: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  signupRow: {
    marginTop: 28,
    alignItems: 'center',
  },
  signupText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  signupLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
