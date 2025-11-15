import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { setCurrentTenant } from '@app/store/slices/tenantSlice';
import { colors, spacing, typography, borderRadius } from '@theme';
import { Button } from '@shared/components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RouteParams {
  slug: string;
}

const ShopDetailScreen = ({ route, navigation }: any) => {
  const { slug } = route.params as RouteParams;
  const dispatch = useDispatch();
  const nearbyTenants = useSelector((state: RootState) => state.tenant.nearbyTenants);

  const shop = nearbyTenants.find((t) => t.slug === slug);

  useEffect(() => {
    if (shop) {
      dispatch(setCurrentTenant(shop));
    }
  }, [shop]);

  if (!shop) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Coffee shop not found</Text>
      </View>
    );
  }

  const handleViewMenu = () => {
    navigation.navigate('Menu');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Shop Image */}
      {shop.branding?.logoUrl ? (
        <Image
          source={{ uri: shop.branding.logoUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.headerImage, styles.placeholderImage]}>
          <Icon name="coffee" size={80} color={colors.gray400} />
        </View>
      )}

      {/* Shop Info */}
      <View style={styles.content}>
        <Text style={styles.shopName}>{shop.name}</Text>

        {shop.description && (
          <Text style={styles.description}>{shop.description}</Text>
        )}

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Icon name="map-marker" size={24} color={colors.primary} />
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{shop.distance?.toFixed(1)} km away</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="star" size={24} color={colors.warning} />
            <Text style={styles.infoLabel}>Rating</Text>
            <Text style={styles.infoValue}>{shop.rating || 'N/A'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="clock-outline" size={24} color={colors.success} />
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, styles.openText]}>
              {shop.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.addressCard}>
            <Icon name="map-marker-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.addressText}>{shop.address}</Text>
          </View>
        </View>

        {/* Contact */}
        {shop.phoneNumber && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <View style={styles.contactCard}>
              <Icon name="phone-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.contactText}>{shop.phoneNumber}</Text>
            </View>
          </View>
        )}

        {/* Operating Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>
          <View style={styles.hoursCard}>
            <Text style={styles.hoursText}>Monday - Friday: 7:00 AM - 8:00 PM</Text>
            <Text style={styles.hoursText}>Saturday - Sunday: 8:00 AM - 9:00 PM</Text>
          </View>
        </View>

        {/* View Menu Button */}
        <Button
          title="View Menu"
          onPress={handleViewMenu}
          style={styles.menuButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray100,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  shopName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
  },
  openText: {
    color: colors.success,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.lineHeight.relaxed,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  hoursCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hoursText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  menuButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
    textAlign: 'center',
  },
});

export default ShopDetailScreen;
