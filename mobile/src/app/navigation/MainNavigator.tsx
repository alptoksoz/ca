import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { colors } from '@/theme';

// Screens
import DiscoverScreen from '@/features/discover/screens/DiscoverScreen';
import ShopDetailScreen from '@/features/discover/screens/ShopDetailScreen';
import { MenuScreen } from '@/features/menu/screens/MenuScreen';
import { MenuItemDetailScreen } from '@/features/menu/screens/MenuItemDetailScreen';
import { CartScreen } from '@/features/cart/screens/CartScreen';
import { CheckoutScreen } from '@/features/cart/screens/CheckoutScreen';
import OrderHistoryScreen from '@/features/orders/screens/OrderHistoryScreen';
import { OrderTrackingScreen } from '@/features/orders/screens/OrderTrackingScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';

export type MainStackParamList = {
  Discover: undefined;
  ShopDetail: { slug: string };
  Menu: undefined;
  MenuItemDetail: { item: any };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
};

export type TabParamList = {
  DiscoverTab: undefined;
  OrdersTab: undefined;
  LoyaltyTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const DiscoverStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShopDetail"
        component={ShopDetailScreen}
        options={{ title: 'Coffee Shop' }}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={({ navigation }) => ({
          title: 'Menu',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={{ marginRight: 16 }}
            >
              <Icon name="cart" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="MenuItemDetail"
        component={MenuItemDetailScreen}
        options={{ title: 'Customize' }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Track Order' }}
      />
    </Stack.Navigator>
  );
};

const OrdersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'Orders' }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Track Order' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="DiscoverTab"
        component={DiscoverStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LoyaltyTab"
        component={ProfileScreen} // Placeholder
        options={{
          title: 'Loyalty',
          tabBarLabel: 'Loyalty',
          tabBarIcon: ({ color, size}) => (
            <Icon name="star" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
