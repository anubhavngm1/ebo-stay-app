export interface Package {
  id: number;
  title: string;
  destination_name?: string;
  destination?: string;
  duration?: string;
  nights?: number;
  days?: number;
  price: number;
  original_price?: number;
  image?: string;
  rating?: number;
  reviews_count?: number;
  description?: string;
  inclusions?: string[];
  is_active?: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location?: string;
  city?: string;
  star_rating?: number;
  rating?: number;
  reviews_count?: number;
  price_per_night?: number;
  image?: string;
  images?: string[];
  amenities?: string[];
  description?: string;
  rooms?: Room[];
}

export interface Room {
  id: number;
  name: string;
  price: number;
  capacity?: number;
  amenities?: string[];
}

export interface Activity {
  id: number;
  title: string;
  location?: string;
  duration?: string;
  price: number;
  image?: string;
  rating?: number;
}

export interface Booking {
  id: number;
  booking_id?: string;
  type: 'hotel' | 'package' | 'activity';
  title: string;
  image?: string;
  check_in?: string;
  check_out?: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'confirmed';
  amount?: number;
  guests?: number;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  loyalty_points_balance?: number;
}
