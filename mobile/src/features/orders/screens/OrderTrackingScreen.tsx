import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { colors, spacing, typography, borderRadius } from '@theme';
import { ordersApi, Order } from '@shared/services/api/orders';
import { Button } from '@shared/components/Button';

interface RouteParams {
  orderId: string;
}

const ORDER_STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: '📝' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
  { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'READY', label: 'Ready', icon: '🎉' },
  { key: 'COMPLETED', label: 'Completed', icon: '✨' },
];

export const OrderTrackingScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params as RouteParams;
  const currentTenant = useSelector((state: RootState) => state.tenant.currentTenant);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrder();
    // Poll for updates every 10 seconds
    const interval = setInterval(loadOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async (isRefresh = false) => {
    if (!currentTenant) return;

    try {
      if (!isRefresh) {
        setLoading(true);
      }
      const orderData = await ordersApi.getOrderById(currentTenant.slug, orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrder(true);
  };

  const getStatusIndex = (status: string) => {
    return ORDER_STATUS_STEPS.findIndex((step) => step.key === status);
  };

  const isStepCompleted = (stepKey: string) => {
    if (!order) return false;
    const currentIndex = getStatusIndex(order.status);
    const stepIndex = getStatusIndex(stepKey);
    return stepIndex <= currentIndex;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Order not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Order Header */}
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{order.status.replace('_', ' ')}</Text>
        </View>
      </View>

      {/* Order Status Timeline */}
      <View style={styles.timeline}>
        {ORDER_STATUS_STEPS.map((step, index) => {
          const isCompleted = isStepCompleted(step.key);
          const isCurrent = order.status === step.key;
          const isLast = index === ORDER_STATUS_STEPS.length - 1;

          return (
            <View key={step.key} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineIcon,
                    isCompleted && styles.timelineIconCompleted,
                    isCurrent && styles.timelineIconCurrent,
                  ]}
                >
                  <Text style={styles.timelineIconText}>{step.icon}</Text>
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      isCompleted && styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelCompleted,
                    isCurrent && styles.timelineLabelCurrent,
                  ]}
                >
                  {step.label}
                </Text>
                {isCurrent && order.estimatedReadyTime && (
                  <Text style={styles.timelineEstimate}>
                    Est. {new Date(order.estimatedReadyTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Order Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Type</Text>
            <Text style={styles.detailValue}>
              {order.orderType.replace('_', ' ')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text
              style={[
                styles.detailValue,
                order.paymentStatus === 'PAID' && styles.paidText,
              ]}
            >
              {order.paymentStatus}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Placed At</Text>
            <Text style={styles.detailValue}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>
          {order.specialInstructions && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Special Instructions</Text>
              <Text style={styles.detailValue}>{order.specialInstructions}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
        <View style={styles.itemsCard}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.customizations.length > 0 && (
                    <View style={styles.customizations}>
                      {item.customizations.map((customization, index) => (
                        <Text key={index} style={styles.customizationText}>
                          • {customization.name}
                        </Text>
                      ))}
                    </View>
                  )}
                  {item.specialInstructions && (
                    <Text style={styles.itemInstructions}>
                      Note: {item.specialInstructions}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.itemPrice}>${item.subtotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
          </View>
          {order.deliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                ${order.deliveryFee.toFixed(2)}
              </Text>
            </View>
          )}
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${order.discount.toFixed(2)}
              </Text>
            </View>
          )}
          {order.loyaltyPointsUsed > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Loyalty Points Used</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                {order.loyaltyPointsUsed} points
              </Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Paid</Text>
            <Text style={styles.summaryTotalValue}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
          {order.loyaltyPointsEarned > 0 && (
            <View style={styles.pointsEarned}>
              <Text style={styles.pointsEarnedText}>
                🎁 You earned {order.loyaltyPointsEarned} loyalty points!
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
        <View style={styles.actions}>
          <Button
            title="Cancel Order"
            variant="outline"
            onPress={() => {
              // TODO: Implement cancel order
            }}
            style={styles.cancelButton}
          />
        </View>
      )}
    </ScrollView>
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
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  timeline: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray100,
    borderWidth: 2,
    borderColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  timelineIconCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineIconText: {
    fontSize: 24,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.gray300,
    marginVertical: spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.lg,
  },
  timelineLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  timelineLabelCompleted: {
    color: colors.text,
    fontWeight: typography.fontWeight.medium as any,
  },
  timelineLabelCurrent: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold as any,
  },
  timelineEstimate: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    marginTop: spacing.xs,
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
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium as any,
    textTransform: 'capitalize',
  },
  paidText: {
    color: colors.success,
  },
  itemsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  itemLeft: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  itemQuantity: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    minWidth: 30,
  },
  itemName: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  customizations: {
    marginTop: spacing.xs,
  },
  customizationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  itemInstructions: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
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
  pointsEarned: {
    backgroundColor: colors.successLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  pointsEarnedText: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    textAlign: 'center',
  },
  actions: {
    padding: spacing.lg,
  },
  cancelButton: {
    borderColor: colors.error,
  },
});
