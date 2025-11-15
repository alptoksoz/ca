import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/theme';

// Screens
import DiscoverScreen from '@/features/discover/screens/DiscoverScreen';
import ShopDetailScreen from '@/features/discover/screens/ShopDetailScreen';
import OrderHistoryScreen from '@/features/orders/screens/OrderHistoryScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';

export type MainStackParamList = {
  Discover: undefined;
  ShopDetail: { slug: string };
  Menu: { slug: string };
  ItemDetail: { tenantSlug: string; itemSlug: string };
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
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
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
        component={OrderHistoryScreen}
        options={{
          title: 'Orders',
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
