import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [customerId, setCustomerId] = useState('');

  const refresh = useCallback(async () => {
    try {
      const session = await SecureStore.getItemAsync('user_session');
      const name = await SecureStore.getItemAsync('user_name');
      const phone = await SecureStore.getItemAsync('user_phone');
      const cid = await SecureStore.getItemAsync('customer_id');
      // Only real login (session === '1'), not guest
      const logged = session === '1';
      setIsLoggedIn(logged);
      setUserName(logged ? (name || '') : '');
      setUserPhone(logged ? (phone || '') : '');
      setCustomerId(logged ? (cid || '') : '');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      refresh();
    }, [refresh])
  );

  return { isLoggedIn, isLoading, userName, userPhone, customerId, refresh };
}
