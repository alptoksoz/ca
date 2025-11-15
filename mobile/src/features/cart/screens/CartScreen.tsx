import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@app/store';
import {
  updateItemQuantity,
  removeItem,
  clearCart,
} from '@app/store/slices/cartSlice';
import { colors, spacing, typography, borderRadius } from '@theme';
import { Button } from '@shared/components/Button';

export const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { items, totals } = useSelector((state: RootState) => state.cart);
  const currentTenant = useSelector((state: RootState) => state.tenant.currentTenant);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(itemId));
    } else {
      dispatch(updateItemQuantity({ itemId, quantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add items from the menu to get started
        </Text>
        <Button
          title="Browse Menu"
          onPress={() => navigation.navigate('Menu')}
          style={styles.browseButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Store Info */}
        {currentTenant && (
          <View style={styles.storeInfo}>
            <Text style={styles.storeLabel}>Ordering from</Text>
            <Text style={styles.storeName}>{currentTenant.name}</Text>
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${item.basePrice.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Customizations */}
              {item.customizations.length > 0 && (
                <View style={styles.customizations}>
                  {item.customizations.map((customization, index) => (
                    <View key={index} style={styles.customization}>
                      <Text style={styles.customizationText}>
                        • {customization.name}
                      </Text>
                      {customization.priceModifier !== 0 && (
                        <Text style={styles.customizationPrice}>
                          {customization.priceModifier > 0 ? '+' : ''}$
                          {customization.priceModifier.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Special Instructions */}
              {item.specialInstructions && (
                <Text style={styles.instructions}>
                  Note: {item.specialInstructions}
                </Text>
              )}

              {/* Quantity and Subtotal */}
              <View style={styles.itemFooter}>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemSubtotal}>
                  ${item.subtotal.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
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
              ${totals.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => dispatch(clearCart())}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
        <Button
          title={`Checkout • $${totals.total.toFixed(2)}`}
          onPress={handleCheckout}
          style={styles.checkoutButton}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  browseButton: {
    paddingHorizontal: spacing.xl,
  },
  storeInfo: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  storeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  storeName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
  },
  itemsContainer: {
    padding: spacing.lg,
  },
  cartItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  removeButton: {
    padding: spacing.xs,
  },
  removeButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
  },
  customizations: {
    marginBottom: spacing.sm,
  },
  customization: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  customizationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  customizationPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  instructions: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.text,
    fontWeight: typography.fontWeight.bold as any,
  },
  quantityValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  itemSubtotal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.primary,
  },
  summary: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    gap: spacing.md,
  },
  clearButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.error,
  },
  checkoutButton: {
    flex: 1,
  },
});
