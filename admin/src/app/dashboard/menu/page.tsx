'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { menuApi, Category, MenuItem } from '@/lib/api/services/menu';
import {
  Plus,
  Pencil,
  Trash2,
  Coffee,
  ToggleLeft,
  ToggleRight,
  FolderOpen,
} from 'lucide-react';
import CategoryModal from '@/components/menu/CategoryModal';
import MenuItemModal from '@/components/menu/MenuItemModal';

type Tab = 'categories' | 'items';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const queryClient = useQueryClient();
  const tenantId = '1'; // Mock - get from auth context

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', tenantId],
    queryFn: () => menuApi.getCategories(tenantId),
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems', tenantId, selectedCategory],
    queryFn: () => {
      const categoryId = selectedCategory !== 'all' ? selectedCategory : undefined;
      return menuApi.getMenuItems(tenantId, categoryId);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => menuApi.deleteCategory(tenantId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', tenantId] });
    },
  });

  // Delete menu item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => menuApi.deleteMenuItem(tenantId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', tenantId] });
    },
  });

  // Toggle item availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ itemId, isAvailable }: { itemId: string; isAvailable: boolean }) =>
      menuApi.toggleItemAvailability(tenantId, itemId, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', tenantId] });
    },
  });

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategoryMutation.mutateAsync(categoryId);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItemMutation.mutateAsync(itemId);
    }
  };

  const handleToggleAvailability = (item: MenuItem) => {
    toggleAvailabilityMutation.mutate({
      itemId: item.id,
      isAvailable: !item.isAvailable,
    });
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === selectedCategory);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your menu categories and items
            </p>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'categories') {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              } else {
                setEditingItem(null);
                setItemModalOpen(true);
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab === 'categories' ? 'Category' : 'Item'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'categories'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'items'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Coffee className="w-4 h-4 inline mr-2" />
              Menu Items ({menuItems.length})
            </button>
          </nav>
        </div>

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new category.
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                >
                  {category.imageUrl && (
                    <div className="h-32 bg-gray-200">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Order: {category.displayOrder}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              category.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Menu Items View */}
        {activeTab === 'items' && (
          <>
            {/* Category Filter */}
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm">
              <label className="text-sm font-medium text-gray-700 mr-3">
                Filter by Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 inline-block px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itemsLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Coffee className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new menu item.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {item.imageUrl ? (
                      <div className="h-40 bg-gray-200">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-100 flex items-center justify-center">
                        <Coffee className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-primary-600">
                              ${item.basePrice.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleToggleAvailability(item)}
                              className="inline-flex items-center"
                            >
                              {item.isAvailable ? (
                                <ToggleRight className="w-8 h-8 text-green-500" />
                              ) : (
                                <ToggleLeft className="w-8 h-8 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        tenantId={tenantId}
      />

      <MenuItemModal
        isOpen={itemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        categories={categories}
        tenantId={tenantId}
      />
    </DashboardLayout>
  );
}
