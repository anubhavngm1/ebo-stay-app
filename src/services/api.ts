import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://www.ebostay.com/pwa/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const customerId = await SecureStore.getItemAsync('customer_id');
    if (customerId) {
      config.headers['X-Customer-Id'] = customerId;
    }
  } catch {}
  return config;
});

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

function mapPackage(p: any) {
  if (!p) return p;
  const price = Number(p.discount_price || p.price || 0);
  const nights = p.duration_nights ?? p.nights;
  const days = p.duration_days ?? p.days;
  let image = p.image_url || p.image || '';
  if (image && !image.startsWith('http')) {
    image = image.startsWith('/')
      ? `https://www.ebostay.com${image}`
      : `https://www.ebostay.com/assets/images/${image}`;
  }
  return {
    id: p.id,
    title: p.title,
    destination_name: p.destination || p.destination_name,
    duration: nights != null ? `${nights}N / ${(days || Number(nights) + 1)}D` : p.duration,
    nights,
    days,
    price,
    original_price: p.price ? Number(p.price) : undefined,
    image,
    rating: p.rating ? Number(p.rating) : undefined,
    reviews_count: p.reviews_count,
    description: p.description,
    slug: p.slug,
    inclusions: p.inclusions,
  };
}

function mapHotel(h: any) {
  if (!h) return h;
  let image = h.image_url || h.image || '';
  if (image && !image.startsWith('http')) {
    image = image.startsWith('/')
      ? `https://www.ebostay.com${image}`
      : `https://www.ebostay.com/assets/images/hotels/${image}`;
  }
  return {
    id: h.id,
    name: h.name,
    location: h.location || h.city,
    city: h.city,
    star_rating: h.star_rating,
    rating: h.rating || h.star_rating,
    reviews_count: h.reviews_count,
    price_per_night: Number(h.price_per_night || 0),
    image,
    description: h.description,
    amenities: h.amenities,
    rooms: h.rooms,
  };
}

export const authApi = {
  me: () => get('me'),
  login: (email: string, password: string) => post('login', { email, password }),
  logout: () => post('logout'),
  phoneSendOtp: (phone: string) => post('phone-send-otp', { phone }),
  phoneVerifyOtp: (phone: string, otp: string) => post('phone-verify-otp', { phone, otp }),
  phoneResendOtp: (phone: string) => post('phone-resend-otp', { phone }),
};

export const dataApi = {
  packages: async (params: any = {}) => {
    const res = await get('packages', params);
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(mapPackage);
    }
    return res;
  },
  package: async (id: string | number) => {
    const res = await get('package', { id });
    if (res.success && res.data) res.data = mapPackage(res.data);
    return res;
  },
  hotels: async (params: any = {}) => {
    const res = await get('hotels', params);
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(mapHotel);
    }
    return res;
  },
  hotel: async (id: string | number) => {
    const res = await get('hotel', { id });
    if (res.success && res.data) res.data = mapHotel(res.data);
    return res;
  },
  activities: (params: any = {}) => get('activities', params),
  destinations: () => get('destinations'),
  myBookings: () => get('my-bookings'),
  profile: () => get('profile'),
};

export const bookingApi = {
  checkAvailability: (data: any) => bookingPost('check-availability', data),
  hotelInitiate: (data: any) => bookingPost('hotel-initiate', data),
  hotelVerify: (data: any) => bookingPost('hotel-verify', data),
  initiate: (data: any) => bookingPost('initiate', data),
  verify: (data: any) => bookingPost('verify', data),
  checkCoupon: (code: string, amount: number) => bookingPost('check-coupon', { code, amount }),
};

export default api;
