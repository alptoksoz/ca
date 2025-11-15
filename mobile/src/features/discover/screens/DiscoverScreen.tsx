import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/app/navigation/MainNavigator';
import { colors, spacing, typography, shadows } from '@/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type DiscoverScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Discover'
>;

interface CoffeeShop {
  id: string;
  slug: string;
  businessName: string;
  description?: string;
  city?: string;
  distance?: number;
  averageRating?: number;
  isOpen?: boolean;
}

const DiscoverScreen = () => {
  const navigation = useNavigation<DiscoverScreenNavigationProp>();
  const [shops, setShops] = useState<CoffeeShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch nearby shops from API
    // Simulating API call
    setTimeout(() => {
      setShops([
        {
          id: '1',
          slug: 'nostaljik-kahve',
          businessName: 'Nostaljik Kahve Evi',
          description: 'Sıcak ve samimi atmosferde özel kahve deneyimi',
          city: 'Istanbul',
          distance: 0.8,
          averageRating: 4.5,
          isOpen: true,
        },
        {
          id: '2',
          slug: 'brew-masters',
          businessName: 'Brew Masters',
          description: 'Artisan coffee roasters',
          city: 'Istanbul',
          distance: 1.2,
          averageRating: 4.8,
          isOpen: true,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderShop = ({ item }: { item: CoffeeShop }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => navigation.navigate('ShopDetail', { slug: item.slug })}
    >
      <View style={styles.shopHeader}>
        <View style={styles.shopTitleContainer}>
          <Text style={styles.shopName}>{item.businessName}</Text>
          {item.isOpen !== undefined && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.isOpen ? colors.success : colors.error },
              ]}
            >
              <Text style={styles.statusText}>
                {item.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          )}
        </View>

        {item.distance !== undefined && (
          <View style={styles.distanceContainer}>
            <Icon name="map-marker" size={16} color={colors.textSecondary} />
            <Text style={styles.distanceText}>{item.distance} km</Text>
          </View>
        )}
      </View>

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.shopFooter}>
        <View style={styles.locationContainer}>
          <Icon name="map-marker-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.locationText}>{item.city}</Text>
        </View>

        {item.averageRating !== undefined && (
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Find amazing coffee shops nearby</Text>
      </View>

      <FlatList
        data={shops}
        renderItem={renderShop}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  shopCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  shopTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.white,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
});

export default DiscoverScreen;
