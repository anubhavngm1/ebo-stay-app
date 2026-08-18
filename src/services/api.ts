import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://www.ebostay.com/pwa/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // for session cookies if backend allows
});

// Helper
async function get(action: string, params: Record<string, any> = {}) {
  const res = await api.get('/customer.php', { params: { action, ...params } });
  return res.data;
}

async function post(action: string, body: Record<string, any> = {}) {
  const res = await api.post('/customer.php', body, { params: { action } });
  return res.data;
}

async function bookingPost(action: string, body: Record<string, any> = {}) {
  const res = await api.post('/booking.php', body, { params: { action } });
  return res.data;
}

// ============ AUTH ============
export const authApi = {
  me: () => get('me'),
  login: (email: string, password: string) => post('login', { email, password }),
  logout: () => post('logout'),
  phoneSendOtp: (phone: string) => post('phone-send-otp', { phone }),
  phoneVerifyOtp: (phone: string, otp: string) => post('phone-verify-otp', { phone, otp }),
  phoneResendOtp: (phone: string) => post('phone-resend-otp', { phone }),
  registerStart: (data: { name: string; email: string; phone: string; password: string }) =>
    post('register-start', data),
  registerVerify: (data: { phone: string; otp: string }) => post('register-verify', data),
};

// ============ DATA ============
export const dataApi = {
  packages: (params: any = {}) => get('packages', params),
  package: (id: string | number) => get('package', { id }),
  hotels: (params: any = {}) => get('hotels', params),
  hotel: (id: string | number) => get('hotel', { id }),
  activities: (params: any = {}) => get('activities', params),
  activity: (id: string | number) => get('activity', { id }),
  destinations: () => get('destinations'),
  myBookings: () => get('my-bookings'),
  profile: () => get('profile'),
  wishlist: () => get('wishlist'),
  wishlistToggle: (type: string, id: number) => post('wishlist-toggle', { type, id }),
};

// ============ BOOKING ============
export const bookingApi = {
  checkAvailability: (data: any) => bookingPost('check-availability', data),
  hotelInitiate: (data: any) => bookingPost('hotel-initiate', data),
  hotelVerify: (data: any) => bookingPost('hotel-verify', data),
  initiate: (data: any) => bookingPost('initiate', data),
  verify: (data: any) => bookingPost('verify', data),
  checkCoupon: (code: string, amount: number) => bookingPost('check-coupon', { code, amount }),
  cancel: (data: any) => bookingPost('cancel', data),
};

export default api;
