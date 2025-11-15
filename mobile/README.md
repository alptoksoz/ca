# Coffee Shop Mobile App

React Native mobile application for the Local Coffee Shop Super App.

## 🚀 Tech Stack

- **React Native** (cross-platform)
- **TypeScript** (type safety)
- **React Navigation** (navigation)
- **Redux Toolkit** (state management)
- **React Query** (API data fetching)
- **Axios** (HTTP client)
- **Socket.io-client** (real-time order tracking)
- **React Native Paper** (UI components)
- **React Native Maps** (geolocation)
- **Firebase** (push notifications)

## 📁 Project Structure

```
mobile/
├── src/
│   ├── app/
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── MainNavigator.tsx
│   │   └── store/
│   │       ├── index.ts
│   │       └── slices/
│   │           ├── authSlice.ts
│   │           ├── cartSlice.ts
│   │           └── tenantSlice.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   └── ForgotPasswordScreen.tsx
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   ├── discover/
│   │   │   ├── screens/
│   │   │   │   ├── DiscoverScreen.tsx     # Map view of coffee shops
│   │   │   │   └── ShopDetailScreen.tsx
│   │   │   └── components/
│   │   │       ├── ShopCard.tsx
│   │   │       └── ShopMap.tsx
│   │   ├── menu/
│   │   │   ├── screens/
│   │   │   │   ├── MenuScreen.tsx
│   │   │   │   └── ItemDetailScreen.tsx
│   │   │   └── components/
│   │   │       ├── CategoryList.tsx
│   │   │       ├── MenuItem.tsx
│   │   │       └── CustomizationModal.tsx
│   │   ├── cart/
│   │   │   ├── screens/
│   │   │   │   ├── CartScreen.tsx
│   │   │   │   └── CheckoutScreen.tsx
│   │   │   └── components/
│   │   │       └── CartItem.tsx
│   │   ├── orders/
│   │   │   ├── screens/
│   │   │   │   ├── OrderHistoryScreen.tsx
│   │   │   │   └── OrderTrackingScreen.tsx
│   │   │   └── components/
│   │   │       ├── OrderCard.tsx
│   │   │       └── OrderStatusIndicator.tsx
│   │   ├── loyalty/
│   │   │   ├── screens/
│   │   │   │   ├── LoyaltyScreen.tsx
│   │   │   │   └── RewardsScreen.tsx
│   │   │   └── components/
│   │   │       └── LoyaltyCard.tsx
│   │   └── profile/
│   │       ├── screens/
│   │       │   ├── ProfileScreen.tsx
│   │       │   └── SettingsScreen.tsx
│   │       └── components/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   └── useLocation.ts
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── tenants.ts
│   │   │   │   ├── menu.ts
│   │   │   │   └── orders.ts
│   │   │   ├── socket/
│   │   │   │   └── orderSocket.ts
│   │   │   ├── storage/
│   │   │   │   └── secureStorage.ts
│   │   │   └── notifications/
│   │   │       └── fcm.ts
│   │   ├── types/
│   │   │   ├── api.types.ts
│   │   │   ├── tenant.types.ts
│   │   │   ├── menu.types.ts
│   │   │   └── order.types.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   └── validation.ts
│   │   └── constants/
│   │       ├── api.ts
│   │       └── theme.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── icons/
├── android/
├── ios/
├── app.json
├── package.json
└── tsconfig.json
```

## 🎨 Key Screens

### 1. Authentication
- **Login**: Email/phone + password
- **Register**: Sign up with email/phone
- **Forgot Password**: Reset via email/SMS

### 2. Discover
- **Map View**: See nearby coffee shops on map
- **List View**: Coffee shops sorted by distance
- **Filters**: By rating, open now, specialty
- **Shop Detail**: View shop info, hours, menu preview

### 3. Menu
- **Categories**: Browse by category
- **Items**: Coffee drinks with images, prices
- **Item Detail**: Full description, nutrition, customizations
- **Customization Modal**: Select size, milk, extras, add-ons

### 4. Cart & Checkout
- **Cart**: Review items, modify quantities
- **Customization Review**: See selected options
- **Checkout**: Payment method, pickup time
- **Apply Rewards**: Use loyalty points or promo codes

### 5. Orders
- **Current Order**: Real-time tracking with status updates
- **Order History**: Past orders with reorder option
- **Order Details**: Full receipt, items, customizations

### 6. Loyalty
- **Points Balance**: Current points per shop
- **Tier Status**: Bronze/Silver/Gold progress
- **Rewards Catalog**: Available rewards to redeem
- **Transaction History**: Points earned/spent

### 7. Profile
- **Account Info**: Edit name, email, phone
- **Saved Addresses**: Delivery addresses
- **Payment Methods**: Saved cards
- **Preferences**: Notifications, language
- **Help & Support**: FAQ, contact

## 🔄 State Management

### Redux Slices

```typescript
// authSlice
{
  user: User | null,
  tokens: { access, refresh },
  isAuthenticated: boolean,
  loading: boolean
}

// cartSlice
{
  items: CartItem[],
  tenant: Tenant,
  subtotal: number,
  total: number
}

// tenantSlice
{
  currentTenant: Tenant | null,
  nearbyTenants: Tenant[],
  branding: BrandingConfig
}
```

## 📡 API Integration

### Axios Client Setup

```typescript
// Base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      await refreshToken();
      return apiClient(error.config);
    }
    return Promise.reject(error);
  },
);
```

## 🔔 Push Notifications

### FCM Integration

```typescript
// Initialize FCM
import messaging from '@react-native-firebase/messaging';

// Request permission
const authStatus = await messaging().requestPermission();

// Get FCM token
const fcmToken = await messaging().getToken();

// Save token to backend
await api.saveDeviceToken(fcmToken);

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  showLocalNotification(remoteMessage);
});

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message:', remoteMessage);
});
```

## 🗺️ Geolocation

```typescript
import Geolocation from '@react-native-community/geolocation';

// Get current position
Geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    fetchNearbyCoffeeShops(latitude, longitude);
  },
  (error) => console.error(error),
  { enableHighAccuracy: true, timeout: 20000 },
);

// Watch position for continuous updates
const watchId = Geolocation.watchPosition((position) => {
  updateUserLocation(position.coords);
});
```

## 🎨 Dynamic Branding

Each coffee shop has custom branding:

```typescript
// Apply tenant branding
const applyBranding = (branding: TenantBranding) => {
  return {
    primaryColor: branding.primaryColor || '#6F4E37',
    secondaryColor: branding.secondaryColor || '#A0826D',
    accentColor: branding.accentColor || '#E6BE8A',
    fontFamily: branding.fontFamily || 'Roboto',
  };
};

// Use in components
const StyledButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.primaryColor};
`;
```

## 🔌 Real-time Order Tracking

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: accessToken },
});

// Subscribe to order updates
socket.emit('subscribe:order', { orderId });

// Listen for status changes
socket.on('order:status_changed', (data) => {
  dispatch(updateOrderStatus(data));
  showNotification(`Order ${data.status}`);
});
```

## 📱 Platform-Specific Features

### iOS
- Apple Pay integration
- FaceID / TouchID for payments
- iOS share sheet

### Android
- Google Pay integration
- Fingerprint authentication
- Android share sheet

## 🚦 Navigation Flow

```
SplashScreen
    ↓
AuthStack (if not logged in)
    - LoginScreen
    - RegisterScreen
    - ForgotPasswordScreen
    ↓
MainStack (if logged in)
    ↓
TabNavigator
    - Discover (Map + List)
    - Orders (History + Tracking)
    - Loyalty (Points + Rewards)
    - Profile (Settings)
```

## 🛠️ Setup Instructions

```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android

# Start Metro bundler
npx react-native start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run E2E tests (Detox)
npm run test:e2e:ios
npm run test:e2e:android
```

## 📦 Build & Release

```bash
# iOS
npx react-native run-ios --configuration Release

# Android
cd android && ./gradlew assembleRelease
```

## 🔐 Environment Variables

Create `.env` file:

```
API_URL=http://localhost:3000/api/v1
SOCKET_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_key
FCM_SENDER_ID=your_sender_id
```

## 📝 Next Steps

- [ ] Initialize React Native project with TypeScript
- [ ] Setup navigation structure
- [ ] Implement authentication screens
- [ ] Create API client with interceptors
- [ ] Build discover/map screen
- [ ] Build menu browsing
- [ ] Implement cart functionality
- [ ] Add order tracking
- [ ] Setup push notifications
- [ ] Add payment integration
- [ ] Implement loyalty features

---

**Status**: 🚧 In Development
**Platform**: iOS & Android
**Framework**: React Native
