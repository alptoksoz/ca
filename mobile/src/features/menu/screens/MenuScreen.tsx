import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { colors, spacing, typography, borderRadius } from '@theme';
import { menuApi, MenuItem, MenuCategory } from '@shared/services/api/menu';
import { MenuItemCard } from '@shared/components/MenuItemCard';

export const MenuScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const currentTenant = useSelector((state: RootState) => state.tenant.currentTenant);

  useEffect(() => {
    if (currentTenant?.slug) {
      loadMenu();
    }
  }, [currentTenant]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const menu = await menuApi.getFullMenu(currentTenant!.slug);
      setCategories(menu.categories);
      if (menu.categories.length > 0) {
        setSelectedCategory(menu.categories[0].id);
      }
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: MenuItem) => {
    navigation.navigate('MenuItemDetail', { item });
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!currentTenant) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Please select a coffee shop first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category.id && styles.categoryTabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items Grid */}
      <FlatList
        data={selectedCategoryData?.menuItems || []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.menuGrid}
        columnWrapperStyle={styles.menuRow}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onPress={handleItemPress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in this category</Text>
          </View>
        }
      />
    </View>
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
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryTabs: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.textSecondary,
  },
  categoryTabTextActive: {
    color: colors.white,
  },
  menuGrid: {
    padding: spacing.md,
  },
  menuRow: {
    justifyContent: 'space-between',
  },
});
