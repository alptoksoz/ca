'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi, MenuItem, Category, CreateMenuItemDto } from '@/lib/api/services/menu';
import { X } from 'lucide-react';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  categories: Category[];
  tenantId: string;
}

export default function MenuItemModal({
  isOpen,
  onClose,
  item,
  categories,
  tenantId,
}: MenuItemModalProps) {
  const [formData, setFormData] = useState<CreateMenuItemDto>({
    name: '',
    description: '',
    basePrice: 0,
    categoryId: '',
    imageUrl: '',
    preparationTime: 5,
    calories: undefined,
    tags: [],
    allergens: [],
    isAvailable: true,
  });
  const [tagInput, setTagInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        basePrice: item.basePrice,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl || '',
        preparationTime: item.preparationTime,
        calories: item.calories,
        tags: item.tags || [],
        allergens: item.allergens || [],
        isAvailable: item.isAvailable,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        basePrice: 0,
        categoryId: categories[0]?.id || '',
        imageUrl: '',
        preparationTime: 5,
        calories: undefined,
        tags: [],
        allergens: [],
        isAvailable: true,
      });
    }
    setErrors({});
  }, [item, isOpen, categories]);

  const createMutation = useMutation({
    mutationFn: (data: CreateMenuItemDto) => menuApi.createMenuItem(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', tenantId] });
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to create menu item' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateMenuItemDto>) =>
      menuApi.updateMenuItem(tenantId, item!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', tenantId] });
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to update menu item' });
    },
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Price must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (formData.preparationTime <= 0) {
      newErrors.preparationTime = 'Preparation time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData = {
      ...formData,
      calories: formData.calories || undefined,
    };

    if (item) {
      await updateMutation.mutateAsync(submitData);
    } else {
      await createMutation.mutateAsync(submitData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleAddAllergen = () => {
    if (allergenInput.trim() && !formData.allergens.includes(allergenInput.trim())) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, allergenInput.trim()],
      });
      setAllergenInput('');
    }
  };

  const handleRemoveAllergen = (allergen: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((a) => a !== allergen),
    });
  };

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Edit Menu Item' : 'Create Menu Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Cappuccino"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe this menu item..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.categoryId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                Price ($) *
              </label>
              <input
                type="number"
                id="basePrice"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                }
                step="0.01"
                min="0"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.basePrice ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
              )}
            </div>

            <div>
              <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700">
                Prep Time (min) *
              </label>
              <input
                type="number"
                id="preparationTime"
                value={formData.preparationTime}
                onChange={(e) =>
                  setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })
                }
                min="1"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.preparationTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.preparationTime && (
                <p className="mt-1 text-sm text-red-600">{errors.preparationTime}</p>
              )}
            </div>

            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                Calories (optional)
              </label>
              <input
                type="number"
                id="calories"
                value={formData.calories || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    calories: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add a tag (e.g., Popular, Hot, Iced)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Allergens</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={allergenInput}
                  onChange={(e) => setAllergenInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddAllergen())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add an allergen (e.g., Milk, Nuts, Gluten)"
                />
                <button
                  type="button"
                  onClick={handleAddAllergen}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                  >
                    {allergen}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergen(allergen)}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Available for orders</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
