# EBO Stay – Native Mobile App

Full React Native (Expo) app matching the provided UI screenshots.

## Screens Included

- Splash
- Onboarding (3 slides)
- Login / OTP Verification
- Home
- Packages
- Package Details
- Hotel List
- Hotel Details
- Select Dates & Guests
- Booking Details
- Payment
- Booking Confirmed
- My Bookings
- Profile

## Tech Stack

- Expo SDK 52
- Expo Router (file-based navigation)
- TypeScript
- Axios (API calls to live `ebostay.com` PWA APIs)

## How to Run

```bash
cd ebo-stay-native
npm install
npx expo start
```

Then scan QR with Expo Go app (Android / iOS).

## Live API Connection

App already points to:

- `https://www.ebostay.com/pwa/api/customer.php`
- `https://www.ebostay.com/pwa/api/booking.php`

**Important:** Backend currently has CORS restricted to website origins.  
For production mobile app you need to either:

1. Add mobile origin / remove CORS restriction for these endpoints, **or**
2. Switch auth from session-cookies to JWT / token-based auth.

Currently the app has fallback sample data so UI works even if API is blocked.

## Package Name

- Android: `com.ebostay.app`
- iOS: `com.ebostay.app`

## Brand Colors (from screenshots)

- Primary Teal: `#0D9488`
- Background: `#FFFFFF`
- Surface: `#F8FAFC`
