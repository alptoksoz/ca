import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@app/store';
import { clearCart } from '@app/store/slices/cartSlice';
import { colors, spacing, typography, borderRadius } from '@theme';
import { Button } from '@shared/components/Button';
import { ordersApi, CreateOrderDto } from '@shared/services/api/orders';

type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export const CheckoutScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { items, totals } = useSelector((state: RootState) => state.cart);
  const currentTenant = useSelector((state: RootState) => state.tenant.currentTenant);
  const user = useSelector((state: RootState) => state.auth.user);

  const [orderType, setOrderType] = useState<OrderType>('TAKEAWAY');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!currentTenant || items.length === 0) {
      return;
    }

    try {
      setLoading(true);

      const orderData: CreateOrderDto = {
        orderType,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          customizations: item.customizations.map((c) => ({
            customizationOptionId: c.customizationOptionId,
          })),
          specialInstructions: item.specialInstructions,
        })),
        specialInstructions: specialInstructions || undefined,
        promotionCode: promotionCode || undefined,
      };

      const order = await ordersApi.createOrder(currentTenant.slug, orderData);

      // Clear cart and navigate to order tracking
      dispatch(clearCart());
      navigation.reset({
        index: 0,
        routes: [
          { name: 'MainTabs' },
          { name: 'OrderTracking', params: { orderId: order.id } },
        ],
      });

      Alert.alert(
        'Order Placed!',
        `Your order #${order.orderNumber} has been placed successfully.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Failed to place order:', error);
      Alert.alert(
        'Order Failed',
        error.response?.data?.message || 'Failed to place order. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const orderTypeOptions: Array<{ value: OrderType; label: string; icon: string }> = [
    { value: 'DINE_IN', label: 'Dine In', icon: '🍽️' },
    { value: 'TAKEAWAY', label: 'Takeaway', icon: '🥤' },
    { value: 'DELIVERY', label: 'Delivery', icon: '🚗' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Store Info */}
        {currentTenant && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordering from</Text>
            <View style={styles.storeCard}>
              <Text style={styles.storeName}>{currentTenant.name}</Text>
              <Text style={styles.storeAddress}>{currentTenant.address}</Text>
            </View>
          </View>
        )}

        {/* Order Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Type</Text>
          <View style={styles.orderTypeContainer}>
            {orderTypeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.orderTypeButton,
                  orderType === option.value && styles.orderTypeButtonActive,
                ]}
                onPress={() => setOrderType(option.value)}
              >
                <Text style={styles.orderTypeIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.orderTypeLabel,
                    orderType === option.value && styles.orderTypeLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Items Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({items.length})</Text>
          <View style={styles.itemsSummary}>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <Text style={styles.summaryItemQuantity}>{item.quantity}x</Text>
                  <View>
                    <Text style={styles.summaryItemName}>{item.name}</Text>
                    {item.customizations.length > 0 && (
                      <Text style={styles.summaryItemCustomizations}>
                        {item.customizations.map((c) => c.name).join(', ')}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.summaryItemPrice}>
                  ${item.subtotal.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Promotion Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promotion Code (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter promotion code"
              placeholderTextColor={colors.gray400}
              value={promotionCode}
              onChangeText={setPromotionCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any special requests for your order?"
            placeholderTextColor={colors.gray400}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${totals.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${totals.tax.toFixed(2)}</Text>
            </View>
            {orderType === 'DELIVERY' && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>$3.00</Text>
              </View>
            )}
            {totals.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Discount
                </Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -${totals.discount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                $
                {(
                  totals.total + (orderType === 'DELIVERY' ? 3.0 : 0)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={loading ? 'Placing Order...' : 'Place Order'}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading || items.length === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  storeCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  storeName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  storeAddress: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  orderTypeButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  orderTypeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  orderTypeIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  orderTypeLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.textSecondary,
  },
  orderTypeLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold as any,
  },
  itemsSummary: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  summaryItemLeft: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  summaryItemQuantity: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    minWidth: 30,
  },
  summaryItemName: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: 2,
  },
  summaryItemCustomizations: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  summaryItemPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.sm,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.white,
  },
  summaryCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  discountLabel: {
    color: colors.success,
  },
  discountValue: {
    color: colors.success,
    fontWeight: typography.fontWeight.semibold as any,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.primary,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
