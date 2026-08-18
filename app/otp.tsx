import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, Radius } from '../src/constants/theme';
import Button from '../src/components/Button';
import { authApi } from '../src/services/api';
import * as SecureStore from 'expo-secure-store';

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    const code = otp.join('');
    if (code.length < 4) {
      Alert.alert('Invalid', 'Please enter complete OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.phoneVerifyOtp(phone || '', code);
      if (res.success) {
        await SecureStore.setItemAsync('user_session', '1');
        if (res.data?.id) await SecureStore.setItemAsync('customer_id', String(res.data.id));
        if (res.data?.name) await SecureStore.setItemAsync('user_name', res.data.name);
        if (res.data?.phone) await SecureStore.setItemAsync('user_phone', res.data.phone);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', res.error || 'Invalid OTP. Please try again.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || e?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendIn > 0 || resending) return;
    setResending(true);
    try {
      try {
        await authApi.phoneResendOtp(phone || '');
      } catch {
        await authApi.phoneSendOtp(phone || '');
      }
      setResendIn(30);
      setOtp(['', '', '', '']);
      Alert.alert('Sent', 'OTP sent again');
    } catch {
      Alert.alert('Error', 'Could not resend OTP. Try again.');
    } finally {
      setResending(false);
    }
  };

  const mm = String(Math.floor(resendIn / 60)).padStart(2, '0');
  const ss = String(resendIn % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify Your Number</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to{'\n'}
        <Text style={styles.phone}>{phone || '+91 XXXXXXXXXX'}</Text>
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={[styles.otpBox, digit ? styles.otpFilled : null]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            selectTextOnFocus
          />
        ))}
      </View>

      {resendIn > 0 ? (
        <Text style={styles.resend}>
          Resend OTP in <Text style={{ color: Colors.primary, fontWeight: '700' }}>{mm}:{ss}</Text>
        </Text>
      ) : (
        <TouchableOpacity onPress={resend} disabled={resending}>
          {resending ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.resendLink}>Resend OTP</Text>
          )}
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }} />
      <Button title="Verify" onPress={verify} loading={loading} style={{ marginBottom: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 28, paddingTop: 60 },
  back: { marginBottom: 28 },
  backText: { fontSize: 28, color: Colors.text },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24, marginBottom: 36 },
  phone: { fontWeight: '700', color: Colors.text },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  otpBox: {
    width: 64, height: 64, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border,
    textAlign: 'center', fontSize: 24, fontWeight: '700', color: Colors.text, backgroundColor: Colors.surface,
  },
  otpFilled: { borderColor: Colors.primary, backgroundColor: Colors.secondary },
  resend: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.sm },
  resendLink: { textAlign: 'center', color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
});
