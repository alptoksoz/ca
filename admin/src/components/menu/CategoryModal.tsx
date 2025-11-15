'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi, Category, CreateCategoryDto } from '@/lib/api/services/menu';
import { X } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  tenantId: string;
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  tenantId,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: '',
    displayOrder: 0,
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        displayOrder: category.displayOrder,
        imageUrl: category.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        displayOrder: 0,
        imageUrl: '',
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => menuApi.createCategory(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', tenantId] });
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to create category' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateCategoryDto>) =>
      menuApi.updateCategory(tenantId, category!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', tenantId] });
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to update category' });
    },
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (category) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div>
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
              placeholder="e.g., Coffee Drinks"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700">
              Display Order
            </label>
            <input
              type="number"
              id="displayOrder"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
              }
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.displayOrder ? 'border-red-300' : 'border-gray-300'
              }`}
              min="0"
            />
            {errors.displayOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.displayOrder}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first in the menu
            </p>
          </div>

          <div>
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

          <div className="flex gap-3 pt-4">
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
              {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
