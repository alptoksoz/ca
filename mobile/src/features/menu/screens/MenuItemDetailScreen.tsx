import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '@app/store/slices/cartSlice';
import { colors, spacing, typography, borderRadius } from '@theme';
import { MenuItem, CustomizationGroup } from '@shared/services/api/menu';
import { Button } from '@shared/components/Button';

interface RouteParams {
  item: MenuItem;
}

export const MenuItemDetailScreen = ({ route, navigation }: any) => {
  const { item } = route.params as RouteParams;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    Record<string, string[]>
  >({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleCustomizationToggle = (groupId: string, optionId: string, maxSelections: number) => {
    setSelectedCustomizations((prev) => {
      const current = prev[groupId] || [];
      const isSelected = current.includes(optionId);

      if (isSelected) {
        return {
          ...prev,
          [groupId]: current.filter((id) => id !== optionId),
        };
      } else {
        if (maxSelections === 1) {
          return {
            ...prev,
            [groupId]: [optionId],
          };
        } else {
          if (current.length < maxSelections) {
            return {
              ...prev,
              [groupId]: [...current, optionId],
            };
          }
        }
      }
      return prev;
    });
  };

  const calculatePrice = () => {
    let total = item.basePrice;
    item.customizations.forEach((group) => {
      const selectedOptions = selectedCustomizations[group.id] || [];
      selectedOptions.forEach((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId);
        if (option) {
          total += option.priceModifier;
        }
      });
    });
    return total * quantity;
  };

  const canAddToCart = () => {
    return item.customizations.every((group) => {
      const selectedCount = (selectedCustomizations[group.id] || []).length;
      return selectedCount >= group.minSelections && selectedCount <= group.maxSelections;
    });
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      return;
    }

    const customizations: Array<{
      customizationOptionId: string;
      name: string;
      priceModifier: number;
    }> = [];

    item.customizations.forEach((group) => {
      const selectedOptions = selectedCustomizations[group.id] || [];
      selectedOptions.forEach((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId);
        if (option) {
          customizations.push({
            customizationOptionId: option.id,
            name: option.name,
            priceModifier: option.priceModifier,
          });
        }
      });
    });

    dispatch(
      addItem({
        menuItemId: item.id,
        name: item.name,
        basePrice: item.basePrice,
        quantity,
        customizations,
        specialInstructions: specialInstructions || undefined,
      })
    );

    navigation.goBack();
  };

  const renderCustomizationGroup = (group: CustomizationGroup) => {
    const selectedOptions = selectedCustomizations[group.id] || [];

    return (
      <View key={group.id} style={styles.customizationGroup}>
        <View style={styles.customizationHeader}>
          <Text style={styles.customizationTitle}>{group.name}</Text>
          {group.required && <Text style={styles.requiredBadge}>Required</Text>}
        </View>
        <Text style={styles.customizationSubtitle}>
          {group.maxSelections === 1
            ? 'Choose 1'
            : `Choose ${group.minSelections} to ${group.maxSelections}`}
        </Text>

        {group.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() =>
                handleCustomizationToggle(group.id, option.id, group.maxSelections)
              }
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionCheckbox,
                    isSelected && styles.optionCheckboxSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.optionName}>{option.name}</Text>
              </View>
              {option.priceModifier !== 0 && (
                <Text style={styles.optionPrice}>
                  {option.priceModifier > 0 ? '+' : ''}${option.priceModifier.toFixed(2)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Item Image */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>☕</Text>
            </View>
          )}
        </View>

        {/* Item Info */}
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          {/* Nutrition & Tags */}
          <View style={styles.infoRow}>
            {item.calories && (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{item.calories} cal</Text>
              </View>
            )}
            {item.preparationTime > 0 && (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{item.preparationTime} min</Text>
              </View>
            )}
          </View>

          {item.tags.length > 0 && (
            <View style={styles.tags}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {item.allergens.length > 0 && (
            <View style={styles.allergens}>
              <Text style={styles.allergensTitle}>Allergens:</Text>
              <Text style={styles.allergensText}>{item.allergens.join(', ')}</Text>
            </View>
          )}

          {/* Customizations */}
          {item.customizations.map(renderCustomizationGroup)}

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.price}>${calculatePrice().toFixed(2)}</Text>
        </View>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          disabled={!canAddToCart()}
          style={styles.addButton}
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
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  content: {
    padding: spacing.lg,
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.relaxed,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  infoBadgeText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  allergens: {
    backgroundColor: colors.warningLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
  },
  allergensTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  allergensText: {
    fontSize: typography.fontSize.sm,
    color: colors.warning,
  },
  customizationGroup: {
    marginBottom: spacing.lg,
  },
  customizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  customizationTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
  },
  requiredBadge: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.medium as any,
  },
  customizationSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold as any,
  },
  optionName: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  optionPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  quantityLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: typography.fontWeight.bold as any,
  },
  quantityValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  priceLabel: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  price: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.primary,
  },
  addButton: {
    width: '100%',
  },
});
